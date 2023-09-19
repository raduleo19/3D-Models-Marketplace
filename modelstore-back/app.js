var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var dotenv = require('dotenv');
dotenv.config();

require('./config/database');

var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var transactionsRouter = require('./routes/transactions');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var productsController = require('./controllers/products');
var usersController = require('./controllers/users');

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/transactions', transactionsRouter);
app.get('/api/publications', usersController.auth, productsController.getAllProductsByPublisher);

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})

module.exports = app;
