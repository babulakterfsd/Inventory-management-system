/* eslint-disable no-underscore-dangle */
const Product = require('../models/Product.model');

module.exports.getAllProductsService = async () => {
    // const products = await Product.where('name')
    //     .equals('dal')
    //     .where('price')
    //     .gt(50)
    //     .lt(100)
    //     .select('name price unit quantity status -_id');

    // const products = await Product.find({ name: { $regex: /mobile/i } }).select(
    //     'name price unit quantity status -_id'
    // );
    const products = await Product.find().select('name price unit quantity _id status');
    return products;
};

module.exports.addANewProductService = async (data) => {
    const product = new Product(data);
    const savedProduct = await product.save();
    savedProduct.logger();
    return savedProduct;
};

module.exports.getSpecificProductByIdService = async (productId) => {
    const product = await Product.findById(productId).select(
        'name price unit quantity description _id status'
    );
    if (!product) {
        throw new Error('No product found with that ID');
    } else {
        return product;
    }
};

module.exports.updateProductByIdService = async (productId, data) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('No product found with that ID');
    } else {
        await Product.updateOne(
            { _id: productId },
            { $set: data },
            {
                runValidators: true, // this will check if the data is valid or not depending on the schema. if this option is not set, then the data will be updated without any validation. suppose, if anyone tries to update the price of a product with a string value, then it will be updated without any error. but if this option is set to true, then it will throw an error.
            }
        );
    }
};

module.exports.deleteProductByIdService = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('No product found with that ID');
    } else {
        await Product.deleteOne({ _id: productId });
    }
};

module.exports.bulkUpdateProductsService = async (productsToBeUpdated) => {
    const existingProducts = await Product.find({
        _id: { $in: productsToBeUpdated.map((product) => product.id) },
    });
    const existingProductIds = existingProducts.map((product) => product._id.toString());
    const missingProductIds = productsToBeUpdated
        .filter((product) => !existingProductIds.includes(product.id))
        .map((product) => product.id);

    if (missingProductIds.length === 0) {
        const updatePromises = productsToBeUpdated.map((product) =>
            Product.updateOne({ _id: product.id }, { $set: product.data }, { runValidators: true })
        );

        const updateResults = await Promise.all(updatePromises);
        const modifiedCount = updateResults.reduce((total, res) => total + res.nModified, 0);

        return { modifiedCount, message: ` ${updatePromises.length} product updated successfully` };
    }

    return {
        modifiedCount: 0,
        message:
            'One or more products not found with the given IDs. No products updated. Check IDs and try again.',
        missingProductIds,
    };
};

module.exports.bulkDeleteProductsService = async (IDsArray, next) => {
    let result = {};
    try {
        // Check if all product IDs exist
        const existingProducts = await Product.find({ _id: { $in: IDsArray } });
        const existingProductIds = existingProducts.map((product) => product._id.toString());
        const missingProductIds = IDsArray.filter(
            (productId) => !existingProductIds.includes(productId)
        );

        const isValidToDelete = IDsArray.every((productId) =>
            existingProductIds.includes(productId)
        );

        if (isValidToDelete) {
            result = await Product.deleteMany({ _id: { $in: IDsArray } });
            return result;
        }
        return {
            deletedCount: 0,
            message: `One or more products not found with the given IDs. No products deleted. Check IDs and try again.`,
            missingProductIds,
        };
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllproductsService = async () => {
    const result = await Product.deleteMany({});
    return result;
};
