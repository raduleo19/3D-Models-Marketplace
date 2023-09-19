const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  publisher: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  rating: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  images: [String],
  models: {
    type: String,
    required: true
  },
  modelType: {
    type: String,
    required: true
  },
  voxels: {
    type: JSON,
  },
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  earnings: {
    type: Number,
    default: 0
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;