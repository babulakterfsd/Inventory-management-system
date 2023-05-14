const mongoose = require('mongoose');
const validator = require('validator');

const { ObjectId } = mongoose.Schema.Types;

// fresh group 64608586278b97288824e541, aci group 64608646278b97288824e547, tir group 646086cb278b97288824e54d, bashundhara group 6460878b278b97288824e562, rfl group 64608830278b97288824e56a

const brandSchema = mongoose.Schema(
    {
        products: [
            {
                type: ObjectId,
                ref: 'Product',
                required: true,
            },
        ],
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide a brand name'],
            maxLength: 100,
            unique: [true, 'Brand name already exists'],
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
            validate: [validator.isURL, 'Please provide a valid url'],
        },
        location: String,

        suppliers: [
            {
                type: ObjectId,
                ref: 'Supplier',
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
