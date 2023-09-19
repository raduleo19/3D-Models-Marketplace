var Transactions = require('../models/transaction');
var User = require('../models/user');

const createTransaction = async (req, res, next) => {
    try {
        console.log(req.body);

        const newTransaction = new Transactions({
            userId: req.user.id,
            amount: req.body.amount,
        });

        await User.findByIdAndUpdate(req.user.id, { $inc: { balance: req.body.amount } });

        await newTransaction.save();
        res.status(200).send(newTransaction);
    } catch (error) {
        return res
            .status(400).send(error.message);
    }
}

const readUserTransactions = async (req, res, next) => {
    try {
        const transactions = await Transactions.find({ userId: req.user.id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const TransactionId = req.params.id;
        const Transaction = await Transactions.findById(TransactionId);

        if (!Transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (Transaction.userId != req.user.id) {
            return res.status(401).json({ error: 'You are not authorized to delete this Transaction' });
        }

        await Transaction.remove();

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createTransaction, readUserTransactions, deleteTransaction }