const mongoose = require('mongoose');
const brandSchema = require('../schemas/Brand.schema');

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
