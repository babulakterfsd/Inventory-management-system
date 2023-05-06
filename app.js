/*
  Schema -> Model -> Controller -> Routes -> App
*/

/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limitApiCalls');
const indexRoute = require('./routes/v1/index.route');

const app = express();

/* ----------------- Middlewares ------------------ */
app.use(cors());
app.use(express.json());
app.use(limiter); // limits api calls to 1 per minute, a third party middleware
app.use(express.static(`${__dirname}/storage`)); // serving static files from server
app.set('view engine', 'ejs'); // setting view engine to ejs

/* ----------------- Schema Design ------------------ */
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            unique: [true, 'Product name must be unique'],
            minLength: [3, 'Product name must be at least 3 characters long'],
            maxLength: [50, 'Product name must be at most 50 characters long'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price cannot be negative'],
            max: [1000000, 'Product price must be at most 1000000'],
        },
        unit: {
            type: String,
            required: [true, 'Product selling unit is required'],
            enum: {
                values: ['kg', 'litre', 'pcs'],
                message:
                    'Product selling unit must be either kg, litre or pcs, you entered {VALUE}',
            },
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            min: [0, 'Product quantity cannot be negative'],
            validate: {
                validator: (value) => {
                    const isInteger = Number.isInteger(value);
                    if (isInteger) {
                        return true;
                    }
                    return false;
                },
                message: 'Product quantity must be an integer',
            },
        },
        status: {
            type: String,
            required: [true, 'Product status is required'],
            enum: {
                values: ['in-stock', 'out-of-stock', 'discontinued'],
                message:
                    'Product status must be in-stock or out-of-stock or discontinued , you entered {VALUE}',
            },
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'suppliers',
        },
        categories: [
            {
                name: {
                    type: String,
                    required: [true, 'Category name is required'],
                },
                _id: mongoose.Schema.Types.ObjectId,
            },
        ],
    },
    {
        timestamps: true,
    }
);

/* ----------------- Model ------------------ */
const Product = mongoose.model('Product', productSchema);

/* ----------------- Routes ------------------ */

app.post('/api/v1/products', async (req, res, next) => {
    try {
        const product = new Product(req.body);
        if (product.quantity < 1) {
            product.status = 'out-of-stock';
        }
        const savedProduct = await product.save();
        res.status(201).json({
            status: 'success',
            data: savedProduct,
            message: 'Product created successfully',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Product creation failed',
            errorDetails: error.message,
        });
    }
});

app.use('/', indexRoute);

/* ----------------- Global Error Handler ------------------ */
app.use(errorHandler);

module.exports = app;
