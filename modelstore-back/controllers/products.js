var Product = require('../models/product');
var User = require('../models/user');
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require('fs');
const { S3Client, S3 } = require("@aws-sdk/client-s3");
var amqp = require('amqplib/callback_api');
const { send } = require('process');

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

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Upload files to AWS S3
const uploadFileToS3 = async (file, productId) => {
  try {
    const fileStream = fs.createReadStream(file.path);

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key: `/products/${productId}/${file.filename}`,
        Body: fileStream,
      },
    });

    const result = await upload.done();
    const fileUrl = result.Location;

    return fileUrl;
  } catch (error) {
    throw error;
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log(req.body)
    const product = new Product(req.body);
    product.publisher = {id: req.user.id, name: req.user.name};

    const modelFile = req.files['model'][0];
    const imageFiles = req.files['images'];
    const productId = product._id;

    const modelFileUpload = uploadFileToS3(modelFile, productId);
    const imageFileUploads = imageFiles.map(file => uploadFileToS3(file, productId));

    Promise.all([modelFileUpload, ...imageFileUploads]).then((results) => {
      const modelFileUrl = results[0];
      const imageFileUrls = results.slice(1);
      
      product.models = modelFileUrl;
      product.images = imageFileUrls;

      product.save().then((product) => {
        sendToQueue("voxelize", { productId });
        
        // remove multer temp
        fs.unlinkSync(modelFile.path);

        imageFiles.forEach((file) => {
          fs.unlinkSync(file.path);
        });

        res.status(201).json(product);
      }).catch((error) => {
        console.log("Error saving product to database: ", error);
        res.status(400).json({ error: error.message });
      });
    }).catch((error) => {
      console.log("Error uploading files to S3: ", error);
      res.status(400).json({ error: error.message });
    });
  } catch (error) {
    console.log("Error creating product: ", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-models');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products by a specific publisher
const getAllProductsByPublisher = async (req, res) => {
  try {
    const publisherId = req.user.id;    

    Product.find({ "publisher.id": publisherId })
      .then(products => {
        res.json(products);
        console.log('Products retrieved by the specific publisher:', products);
      })
      .catch(error => {
        console.error('Error retrieving products by the specific publisher:', error);
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    var product = await Product.findById(productId).select('-models');

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const options = { new: true }; // Return the updated product
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, options);

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsByPublisher
};