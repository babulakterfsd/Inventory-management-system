const Product = require('../models/Product.model');

module.exports.getAllProducts = async (req, res, next) => {
    try {
        // const products = await Product.where('name')
        //     .equals('Mobile')
        //     .where('price')
        //     .gt(4000)
        //     .lt(8000)
        //     .select('name price unit quantity status -_id');

        // const products = await Product.find({ name: { $regex: /mobile/i } }).select(
        //     'name price unit quantity status -_id'
        // );

        const products = await Product.find().select('name price unit quantity status -_id');

        res.status(200).json({
            status: 'success',
            data: products,
            message: 'Products fetched successfully',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Cannot get products',
            errorDetails: error.message,
        });
    }
};

module.exports.addANewProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        savedProduct.logger();
        res.status(201).json({
            status: 'success',
            data: savedProduct,
            message: 'Product created successfully',
        });
    } catch (error) {
        // res.status(400).json({
        //     status: 'fail',
        //     message: 'Product creation failed',
        //     errorDetails: error.message,
        // });
        next(error);
    }
};
