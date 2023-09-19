var Orders = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');
var amqp = require('amqplib/callback_api');

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

const createOrder = async (req, res, next) => {
    try {
        console.log(req.body);

        const newOrder = new Orders({
            userId: req.user.id,
            products: req.body.products,
            total: req.body.total
        });

        await newOrder.save();
        await sendToQueue("mailer", {
            type: "order",
            email: req.user.email,
            orderId: newOrder._id,
        });

        res.status(200).send('Record saved succesfuly')
    } catch (error) {
        return res
            .status(400).send(error.message);
    }
}

const readUserOrders = async (req, res, next) => {
    try {
        const orders = await Orders.find({ userId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Orders.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.userId != req.user.id) {
            return res.status(401).json({ error: 'You are not authorized to delete this order' });
        }

        await order.remove();

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createOrder, readUserOrders, deleteOrder }