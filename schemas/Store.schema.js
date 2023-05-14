const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

// shob store e store manager id emni ekta deya ache apatoto, user create kore then real id ta dite hobe

const storeSchema = mongoose.Schema(
    {
        products: [
            {
                type: ObjectId,
                ref: 'Product',
            },
        ],
        name: {
            type: String,
            required: [true, 'Store name is required'],
            trim: true,
            unique: [true, 'Product name must be unique'],
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
        description: String,
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        manager: {
            type: ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = storeSchema;
