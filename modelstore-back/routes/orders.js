var express = require('express');
var router = express.Router();
var ordersController = require('../controllers/orders');
var usersController = require('../controllers/users');

router.post('/', usersController.auth, ordersController.createOrder);
router.get('/', usersController.auth, ordersController.readUserOrders);
router.delete('/:id', usersController.auth, ordersController.deleteOrder);

module.exports = router;
