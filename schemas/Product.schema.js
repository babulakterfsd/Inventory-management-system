const mongoose = require('mongoose');
const validator = require('validator');

const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema(
    {
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
                values: ['kg', 'litre', 'pcs'],
                message:
                    'Product selling unit must be either kg, litre or pcs, you entered {VALUE}',
            },
        },
        imageURLs: [
            {
                type: String,
                required: true,
                validate: [validator.isURL, 'Please provide a valid image url'],
            },
        ],
        category: {
            type: String,
            required: [true, 'Product category is required'],
            enum: {
                values: ['grocery', 'food', 'sports', 'other'],
                message:
                    'product category must be either grocery, food, sports or other, you entered {VALUE}',
            },
        },
        brand: {
            name: {
                type: String,
                required: [true, 'Product brand name is required'],
            },
            id: {
                type: ObjectId,
                ref: 'Brand',
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

/* ----------------- Instance Methods ------------------ */
productSchema.methods.logger = function () {
    console.log(`${this.name}'s data saved to database `.gray.bold);
};
module.exports = productSchema;
