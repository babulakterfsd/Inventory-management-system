const {
    getAllProductsService,
    addANewProductService,
    getSpecificProductByIdService,
    updateProductByIdService,
    deleteProductByIdService,
    bulkUpdateProductsService,
    bulkDeleteProductsService,
    deleteAllproductsService,
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
        next(error);
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
        const result = await bulkUpdateProductsService(req.body.products);
        if (result.modifiedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingProductIds,
            });
        }
        res.status(200).json({
            status: 'success',
            message: result.message,
        });
    } catch (error) {
        // next(error); if I also call next(error), the error will be sent and  handled by the global error handler also. then that error function will also try to send an another response. Thus, It won't be a big problem, but will show an warning in the console that Cannot set headers after they are sent to the client. So, as i have handled the error programmatically, I don't need to call next(error) here.
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

module.exports.deleteAllproducts = async (req, res, next) => {
    try {
        const result = await deleteAllproductsService();
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: 'No products deleted, something went wrong',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'All products deleted successfully',
        });
    } catch (error) {
        // next(error);
    }
};
