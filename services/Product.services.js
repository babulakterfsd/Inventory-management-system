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
    const products = await Product.find().select('name price unit quantity status -_id');
    return products;
};

module.exports.addANewProductService = async (data) => {
    const product = new Product(data);
    const savedProduct = await product.save();
    savedProduct.logger();
    return savedProduct;
};
