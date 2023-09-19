const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    products: [{
        name: String,
        price: Number,
        id: mongoose.Schema.Types.ObjectId,
        img: String,
    }],
    date: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Delivered'],
        default: 'Processing'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;