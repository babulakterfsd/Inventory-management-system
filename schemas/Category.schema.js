const mongoose = require('mongoose');
const validator = require('validator');

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxLength: [50, 'Category name must be at most 50 characters long'],
            unique: [true, 'Category name must be unique'],
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

module.exports = categorySchema;
