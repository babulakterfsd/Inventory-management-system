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
