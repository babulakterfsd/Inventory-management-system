const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            unique: [true, 'Product name must be unique'],
            minLength: [3, 'Product name must be at least 3 characters long'],
            maxLength: [50, 'Product name must be at most 50 characters long'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price cannot be negative'],
            max: [1000000, 'Product price must be at most 1000000'],
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
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            min: [0, 'Product quantity cannot be negative'],
            validate: {
                validator: (value) => {
                    const isInteger = Number.isInteger(value);
                    if (isInteger) {
                        return true;
                    }
                    return false;
                },
                message: 'Product quantity must be an integer',
            },
        },
        status: {
            type: String,
            required: [true, 'Product status is required'],
            enum: {
                values: ['in-stock', 'out-of-stock', 'discontinued'],
                message:
                    'Product status must be in-stock or out-of-stock or discontinued , you entered {VALUE}',
            },
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'suppliers',
        },
        categories: [
            {
                name: {
                    type: String,
                    required: [true, 'Category name is required'],
                },
                _id: mongoose.Schema.Types.ObjectId,
            },
        ],
    },
    {
        timestamps: true,
    }
);

/* ----------------- Instance Methods ------------------ */
productSchema.methods.logger = function () {
    console.log(`${this.name}'s data saved to database `.gray.bold);
};

/* ----------------- Middlewares ------------------ */
productSchema.pre('save', function (next) {
    // ekhane save hocche kon method use kora hoise seta, amra jodi find dei ekhane tahole product get korar somoyi ekhane asbe. kintu ekhane find use korbo na, karon data save korar aage quantity check kore tar upor depend kore status set korbo. tai save use kora hoise. proyojon hole find use kora jabe. nicher post middleware eo same kahini
    if (this.quantity < 1) {
        this.status = 'out-of-stock';
    }
    console.log('pre save mongoose middleware'.grey.bold);
    next();
});

productSchema.pre('updateOne', function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.quantity < 1) {
        update.$set.status = 'out-of-stock';
    } else {
        update.$set.status = 'in-stock';
    }
    console.log('pre updateOne mongoose middleware'.grey.bold);
    next();
});

productSchema.post('save', function (doc, next) {
    console.log('post save mongoose middleware'.grey.bold, doc);
    next();
});

module.exports = productSchema;
