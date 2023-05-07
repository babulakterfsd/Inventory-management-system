const { getAllProductsService, addANewProductService } = require('../services/Product.services');

module.exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await getAllProductsService();

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
        const savedProduct = await addANewProductService(req.body);
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
