/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limitApiCalls');
const indexRoute = require('./routes/v1/index.route');

const app = express();

/* ----------------- Express Middlewares ------------------ */
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

/* ----------------- Mongoose Middlewares ------------------ */
productSchema.pre('save', function (next) {
    if (this.quantity < 1) {
        this.status = 'out-of-stock';
    }
    console.log('pre save mongoose middleware');
    next();
});

productSchema.post('save', function (doc, next) {
    // console.log('post save mongoose middleware', doc);
    next();
});

/* ----------------- Instance Methods ------------------ */
productSchema.methods.logger = function () {
    console.log(`${this.name}'s data saved to database`);
};

/* ----------------- Model ------------------ */
const Product = mongoose.model('Product', productSchema);

/* ----------------- Routes ------------------ */

app.get('/api/v1/products', async (req, res, next) => {
    try {
        const products = await Product.where('name')
            .equals('Mobile')
            .where('price')
            .gt(4000)
            .lt(8000)
            .select('name price unit quantity status -_id');

        // const products = await Product.find({ name: { $regex: /mobile/i } }).select(
        //     'name price unit quantity status -_id'
        // );

        res.status(200).json({
            status: 'success',
            data: products,
            message: 'Products fetched successfully',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Cannot get products',
            errorDetails: error.message,
        });
    }
});

app.post('/api/v1/products', async (req, res, next) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        savedProduct.logger();
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
