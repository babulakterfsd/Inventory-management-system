const mongoose = require('mongoose');
const productSchema = require('../schemas/Product.schema');

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
