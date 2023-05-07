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
    return product;
};

module.exports.updateProductByIdService = async (productId, data) => {
    await Product.updateOne({ _id: productId }, { $set: data });
};

module.exports.deleteProductByIdService = async (productId) => {
    await Product.deleteOne({ _id: productId });
};
