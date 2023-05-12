/* eslint-disable no-underscore-dangle */
const Store = require('../models/Store.model');

module.exports.getAllStoreService = async (filters, queries) => {
    const stores = await Store.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(queries.sortBy)
        .select(queries.fields);
    const totalStore = await Store.countDocuments(filters);
    const pageCount = Math.ceil(totalStore / queries.limit);
    return {
        stores,
        totalStore,
        pageCount,
    };
};

module.exports.addANewStoreService = async (data) => {
    const store = new Store(data);
    const savedStore = await store.save();
    return savedStore;
};

module.exports.getSpecificStoreByIdService = async (storeId) => {
    const store = await Store.findById(storeId);
    if (!store) {
        throw new Error('No store found with that ID');
    } else {
        return store;
    }
};
