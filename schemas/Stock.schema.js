const mongoose = require('mongoose');
const validator = require('validator');

const stockSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            unique: [true, 'Product name must be unique'],
            minLength: [3, 'Product name must be at least 3 characters long'],
            maxLength: [50, 'Product name must be at most 50 characters long'],
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        unit: {
            type: String,
            required: [true, 'Product selling unit is required'],
            enum: {
                values: ['kg', 'litre', 'pcs', 'bag'],
                message:
                    'Product selling unit must be either kg, litre, bag or pcs, you entered {VALUE}',
            },
        },
        imageUrls: [
            {
                type: String,
                required: [true, 'Product image url is required'],
                validate: {
                    validator: (value) => {
                        if (Array.isArray(value)) {
                            return false;
                        }
                        let isValid = true;
                        value.forEach((url) => {
                            if (!validator.isURL(url)) {
                                isValid = false;
                            }
                        });
                        return isValid;
                    },
                    message: 'Please provide valid image url',
                },
            },
        ],
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price must be greater than 0'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            min: [0, 'Product quantity cannot be negative'],
        },
        category: {
            name: {
                type: String,
                required: [true, 'Product category name is required'],
            },
        },
        brand: {
            name: {
                type: String,
                required: [true, 'Product brand name is required'],
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Brand',
                required: true,
            },
        },
        status: {
            type: String,
            required: [true, 'Product status is required'],
            enum: {
                values: ['in-stock', 'out-of-stock', 'discontinued'],
                message:
                    "Product status must be either 'in-stock', 'out-of-stock' or 'discontinued'. You entered {VALUE}",
            },
        },
        store: {
            name: {
                type: String,
                required: [true, 'Store name is required'],
                trim: true,
                lowercase: true,
                enum: {
                    values: [
                        'dhaka',
                        'chittagong',
                        'sylhet',
                        'rajshahi',
                        'khulna',
                        'barishal',
                        'rangpur',
                        'mymensingh',
                    ],
                    message:
                        '{VALUE} is not a valid store. It must be one of the following: dhaka, chittagong, sylhet, rajshahi, khulna, barishal, rangpur, mymensingh',
                },
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Store',
            },
        },
        suppliedBy: {
            name: {
                type: String,
                trim: true,
                required: [true, 'Supplier name is required'],
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Supplier',
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = stockSchema;
