const mongoose = require('mongoose');
const validator = require('validator');

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
                values: ['kg', 'litre', 'pcs', 'bag'],
                message:
                    'Product selling unit must be either kg, litre, bag or pcs, you entered {VALUE}',
            },
        },
        imageUrls: {
            type: [
                {
                    type: String,
                    required: true,
                    validate: {
                        validator: (value) => {
                            return validator.isURL(value);
                        },
                        message: 'Please provide a valid image URL',
                    },
                },
            ],
            required: [true, 'Product image URLs are required'],
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            enum: {
                values: ['grocery', 'vegetable', 'fruit', 'meat', 'fish', 'other'],
                message:
                    'product category must be either grocery, vegetable, fruit, meat or fish, you entered {VALUE}',
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
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Product supplier is required'],
            ref: 'Supplier',
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
