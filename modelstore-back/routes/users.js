var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users');

router.post('/', usersController.createUser);
router.post('/login', usersController.login);
router.post('/forgot', usersController.forgotPassword);
router.get('/profile', usersController.auth, usersController.readUser);
router.put('/', usersController.auth, usersController.updateUser);
router.delete('/', usersController.auth, usersController.deleteUser);

module.exports = router;
