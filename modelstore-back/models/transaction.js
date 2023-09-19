const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;