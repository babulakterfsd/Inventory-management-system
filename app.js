/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limitApiCalls');
const indexRoute = require('./routes/v1/index.route');
const Product = require('./models/Product.model');
const ProductRoute = require('./routes/v1/product.route');

const app = express();

/* ----------------- Express Middlewares ------------------ */
app.use(cors());
app.use(express.json());
app.use(limiter); // limits api calls to 1 per minute, a third party middleware
app.use(express.static(`${__dirname}/storage`)); // serving static files from server
app.set('view engine', 'ejs'); // setting view engine to ejs

/* ----------------- Routes ------------------ */
app.use('/api/v1/products', ProductRoute);
app.use('/', indexRoute);

app.all('*', (req, res, next) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

/* ----------------- Global Error Handler ------------------ */
app.use(errorHandler);

module.exports = app;
