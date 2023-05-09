const {
    getAllProductsService,
    addANewProductService,
    getSpecificProductByIdService,
    updateProductByIdService,
    deleteProductByIdService,
    bulkUpdateProductsService,
    bulkDeleteProductsService,
} = require('../services/Product.services');

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
        next(error);
    }
};

module.exports.getSpecificProductById = async (req, res, next) => {
    try {
        const product = await getSpecificProductByIdService(req.params.productId);
        res.status(200).json({
            status: 'success',
            data: product,
            message: 'Product fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.updateProductById = async (req, res, next) => {
    try {
        await updateProductByIdService(req.params.productId, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteProductById = async (req, res, next) => {
    try {
        await deleteProductByIdService(req.params.productId);
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.bulkUpdateProducts = async (req, res, next) => {
    try {
        await bulkUpdateProductsService(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Products updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.bulkDeleteProducts = async (req, res, next) => {
    try {
        const result = await bulkDeleteProductsService(req.body.productIDs, next);
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingProductIds,
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: `${result.deletedCount} product deleted successfully`,
            });
        }
    } catch (error) {
        next(error);
    }
};
