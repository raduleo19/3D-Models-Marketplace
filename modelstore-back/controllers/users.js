const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Product = require('../models/product');
const amqp = require('amqplib/callback_api');

var channel = null;

// Establish connection and channel
const setupRabbitMQ = async () => {
  return new Promise((resolve, reject) => {
    amqp.connect("amqp://rabbitmq:5672", (error, conn) => {
      if (error) {
        return reject(error);
      }
      console.log("Connected to RabbitMQ");

      conn.createChannel((error, ch) => {
        if (error) {
          return reject(error);
        }
        ch.assertQueue("mailer", { durable: false });
        console.log("Channel created");
        channel = ch;
        resolve();
      });
    });
  });
};

// Send to RabbitMQ
const sendToQueue = async (queueName, message) => {
  if (channel == null) {
    console.log("Channel not created");
    await setupRabbitMQ();
  }
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};


const createUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });

    if (user) {
      return res.status(400).send('User already exists');
    } else {
      const newUser = new User({
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        address: data.address,
      });

      await newUser.save();
      res.send('Record saved successfully');
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;

    console.log(data.email);

    const user = await User.findOne({ email: data.email });
    
    if (user) {
      console.log(user);
      bcrypt.compare(data.password, user.password, function (err, result) {
        if (result) {
          let token = jwt.sign({ _id: user._id }, 'secret', {
            expiresIn: '1h',
          });

          let resBody = { token: token, userData: user, status: 'success', type: user.type };

          res.send(resBody);
        } else {
          res.send('Login failed');
        }
      });
    } else {
      return res.status(400).send('User does not exist');
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: decodedToken._id });

    console.log(user);
    if (!user) {
      return res.status(401).send('User does not exist');
    } else {
      if (decodedToken.expiredAt) {
        return res.status(401).send('Token expired');
      }
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

const readUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password, -__v');

    console.log(user);
    if (!user) {
      res.status(404).send('No such document!');
    } else {
      res.send(user);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const data = req.body;

    // Check if user exists
    const user = await User.findOne({ email: data.email });

    if (user) {
      console.log('User exists');
      let token = jwt.sign({ __id: user.__id }, 'secret', {
        expiresIn: '24h',
      });

      const message = {
        type: 'reset_password',
        email: data.email,
        token: token,
      };

      console.log('Sending message to queue');
      await sendToQueue("mailer", message);
    } else {
      return res.status(400).send('User does not exist');
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { password, ...newUserData } = req.body;
    if (password != null) {
      newUserData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
    });

    await Product.updateMany({ "publisher.id": req.user.id }, { "publisher.name": newUserData.name });

    if (updatedUser) {
      res.send('User updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    return res.status(500).json({ general: 'Something went wrong, please try again' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.user.id);
    if (response) {
      res.send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    return res.status(500).json({ general: 'Something went wrong, please try again' });
  }
};

module.exports = { createUser, login, forgotPassword, auth, readUser, updateUser, deleteUser }