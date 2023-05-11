/* eslint-disable no-underscore-dangle */
const Supplier = require('../models/Supplier.model');

module.exports.getAllSuppliersService = async (filters, queries) => {
    const suppliers = await Supplier.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(queries.sortBy)
        .select(queries.fields);
    const totalSuppliers = await Supplier.countDocuments(filters);
    const pageCount = Math.ceil(totalSuppliers / queries.limit);
    return {
        suppliers,
        totalSuppliers,
        pageCount,
    };
};

module.exports.addANewSupplierService = async (data) => {
    const supplier = new Supplier(data);
    const savedSupplier = await supplier.save();
    return savedSupplier;
};

module.exports.getSpecificSupplierByIdService = async (supplierId) => {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
        throw new Error('No supplier found with that ID');
    } else {
        return supplier;
    }
};
