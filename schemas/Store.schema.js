const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
    {
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
        description: String,
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        manager: {
            name: String,
            contactNumber: String,
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = storeSchema;
