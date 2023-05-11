const mongoose = require('mongoose');
const supplierSchema = require('../schemas/Supplier.schema');

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
