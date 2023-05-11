const mongoose = require('mongoose');
const stockSchema = require('../schemas/Stock.schema');

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
