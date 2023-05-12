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
            type: String,
            required: [true, 'Product category is required'],
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
        store: [
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
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Store',
                },
            },
        ],
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
/* ----------------- Middlewares ------------------ */
stockSchema.pre('save', function (next) {
    // ekhane save hocche kon method use kora hoise seta, amra jodi find dei ekhane tahole stock get korar somoyi ekhane asbe. kintu ekhane find use korbo na, karon data save korar aage quantity check kore tar upor depend kore status set korbo. tai save use kora hoise. proyojon hole find use kora jabe. nicher post middleware eo same kahini
    if (this.quantity < 1) {
        this.status = 'out-of-stock';
    }
    console.log('pre save mongoose middleware'.grey.bold);
    next();
});

stockSchema.pre('updateOne', function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.quantity < 1) {
        update.$set.status = 'out-of-stock';
    } else {
        update.$set.status = 'in-stock';
    }
    console.log('pre updateOne mongoose middleware'.grey.bold);
    next();
});

stockSchema.post('save', function (doc, next) {
    console.log('post save mongoose middleware'.grey.bold, doc);
    next();
});

module.exports = stockSchema;
