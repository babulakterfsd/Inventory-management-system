const mongoose = require('mongoose');
const validator = require('validator');

const brandSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            trim: true,
            maxLength: [50, 'Brand name must be at most 50 characters long'],
            unique: [true, 'Brand name must be unique'],
            lowercase: true,
        },
        description: String,
        email: {
            type: String,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        website: {
            type: String,
            validate: [validator.isURL, 'Please provide a valid URL'],
        },
        location: String,
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        suppliers: [
            {
                name: String,
                contactNumber: String,
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Supplier',
                },
            },
        ],
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

/* ----------------- Instance Methods ------------------ */
brandSchema.methods.logger = function () {
    console.log(`${this.name} brand's data saved to the brands collection `.gray.bold);
};

module.exports = brandSchema;
