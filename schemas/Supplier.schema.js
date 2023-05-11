const mongoose = require('mongoose');
const validator = require('validator');

const supplierSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Supplier name is required'],
            trim: true,
            maxLength: [50, 'Supplier name must be at most 50 characters long'],
            unique: [true, 'Supplier name must be unique'],
            lowercase: true,
        },
        description: String,
        imageUrl: {
            type: String,
            validate: [validator.isURL, 'Please provide a valid image URL'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = supplierSchema;
