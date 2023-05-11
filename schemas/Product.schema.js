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
        imageUrls: [
            {
                type: String,
                required: [true, 'Product image url is required'],
                validate: {
                    validator: (value) => {
                        if (Array.isArray(value)) {
                            return false;
                        }
                        let isValid = true;
                        value.forEach((url) => {
                            if (!validator.isURL(url)) {
                                isValid = false;
                            }
                        });
                        return isValid;
                    },
                    message: 'Please provide valid image url',
                },
            },
        ],
        category: {
            name: {
                type: String,
                required: [true, 'Product category name is required'],
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
