var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users');
var transactionsController = require('../controllers/transactions');

router.post('/', usersController.auth, transactionsController.createTransaction);
router.get('/', usersController.auth, transactionsController.readUserTransactions);
router.delete('/:id', usersController.auth, transactionsController.deleteTransaction);

module.exports = router;
