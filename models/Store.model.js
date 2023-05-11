const mongoose = require('mongoose');
const storeSchema = require('../schemas/Store.schema');

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
