const mongoose = require('mongoose');
const categorySchema = require('../schemas/Category.schema');

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
