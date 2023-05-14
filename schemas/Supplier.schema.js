const mongoose = require('mongoose');

const validator = require('validator');

const { ObjectId } = mongoose.Schema.Types;

// ["64609086e68ec93f6cb4923a", "646090dae68ec93f6cb4923c", "64609101e68ec93f6cb4923e", "6460911fe68ec93f6cb49240"]

const supplierSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Supplier name is required'],
            trim: true,
            lowercase: true,
            minLength: [3, 'Name must be at least 3 characters.'],
            maxLength: [100, 'Name is too large'],
        },
        email: {
            type: String,
            validate: [validator.isEmail, 'Provide a valid Email'],
            trim: true,
            lowercase: true,
            unique: true,
        },
        brand: [
            {
                type: ObjectId,
                required: true,
                ref: 'Brand',
            },
        ],
        contactNumber: {
            type: String,
            required: [true, 'Please provide a contact number'],
            validate: {
                validator: (value) => {
                    return validator.isMobilePhone(value);
                },
                message: 'Please provide a valid phone number',
            },
        },

        emergencyContactNumber: {
            type: String,
            required: [true, 'Please provide an emergency contact number'],
            validate: {
                validator: (value) => {
                    return validator.isMobilePhone(value);
                },
                message: 'Please provide a valid phone number',
            },
        },
        tradeLicenceNumber: {
            type: Number,
            required: [true, 'Please provide your trade licence number'],
        },
        presentAddress: {
            type: String,
            required: [true, 'Please provide your present address'],
        },
        permanentAddress: {
            type: String,
            required: [true, 'Please provide your present address'],
        },
        location: {
            type: String,
            required: true,
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
                message: '{VALUE} is not correct!',
            },
        },
        imageURL: {
            type: String,
            validate: [validator.isURL, 'Please provide a valid url'],
        },
        nationalIdImageURL: {
            type: String,
            required: true,
            validate: [validator.isURL, 'Please provide a valid url'],
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'inactive'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = supplierSchema;
