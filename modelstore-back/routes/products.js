var express = require('express');
var router = express.Router();
var productsController = require('../controllers/products');
var usersController = require('../controllers/users');
var multer = require('multer');
const upload = multer({ dest: 'upload/' });

router.post('/', usersController.auth, upload.fields([
    { name: 'model', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), productsController.createProduct);
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.put('/:id', usersController.auth, productsController.updateProduct);
router.delete('/:id', usersController.auth, productsController.deleteProduct);

module.exports = router;
