/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limitApiCalls');
const indexRoute = require('./routes/v1/index.route');
const ProductRoute = require('./routes/v1/product.route');
const BrandRoute = require('./routes/v1/brand.route');
const SupplierRoute = require('./routes/v1/supplier.route');

const app = express();
app.use(express.static(`${__dirname}/storage`)); // serving static files from server
app.set('view engine', 'ejs'); // setting view engine to ejs

/* ----------------- Express Middlewares ------------------ */
app.use(cors());
app.use(express.json());
app.use(limiter); // limits api calls to 3 calls per minute, a third party middleware

/* ----------------- Routes ------------------ */
app.use('/api/v1/products', ProductRoute);
app.use('/api/v1/brands', BrandRoute);
app.use('/api/v1/suppliers', SupplierRoute);
app.use('/', indexRoute);

app.all('*', (req, res, next) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

/* ----------------- Global Error Handler ------------------ */
app.use(errorHandler);

module.exports = app;
