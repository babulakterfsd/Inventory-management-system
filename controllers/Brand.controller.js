const {
    addANewBrandService,
    getAllBrandsService,
    getSpecificBrandByIdService,
    updateBrandByIdService,
    deleteBrandByIdService,
    bulkUpdateBrandsService,
    bulkDeleteBrandsService,
    deleteAllBrandsService,
} = require('../services/Brand.services');

module.exports.getAllBrands = async (req, res, next) => {
    try {
        // filters
        let filters = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => delete filters[field]);
        const filterString = JSON.stringify(filters);
        const filterStringWithDollarSign = filterString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        filters = JSON.parse(filterStringWithDollarSign);

        // queries
        const queries = {};
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            queries.sortBy = sortBy;
        }
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            queries.fields = fields;
        }
        if (req.query.page) {
            const { page = 1, limit = 2 } = req.query;
            const skip = (page - 1) * Number(limit);
            queries.skip = skip;
            queries.limit = Number(limit);
        }

        const { brands, totalBrands, pageCount } = await getAllBrandsService(filters, queries);

        if (brands.length > 0) {
            res.status(200).json({
                status: 'success',
                data: brands,
                totalBrands,
                pageCount,
                message: 'Brand fetched successfully',
            });
        }
        if (brands.length === 0) {
            res.status(200).json({
                status: 'success',
                totalBrands,
                pageCount,
                message:
                    'Request processed successfully but no brands found. Check your query parameters and try again.',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.addANewBrand = async (req, res, next) => {
    try {
        const savedBrand = await addANewBrandService(req.body);
        res.status(201).json({
            status: 'success',
            data: savedBrand,
            message: 'Brand created successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSpecificBrandById = async (req, res, next) => {
    try {
        const brand = await getSpecificBrandByIdService(req.params.brandId);
        res.status(200).json({
            status: 'success',
            data: brand,
            message: 'Brand fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.updateBrandById = async (req, res, next) => {
    try {
        await updateBrandByIdService(req.params.brandId, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Brand updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteBrandById = async (req, res, next) => {
    try {
        await deleteBrandByIdService(req.params.brandId);
        res.status(200).json({
            status: 'success',
            message: 'Brand deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.bulkUpdateBrands = async (req, res, next) => {
    try {
        const result = await bulkUpdateBrandsService(req.body.brands);
        if (result.modifiedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingBrandIds,
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

module.exports.bulkDeleteBrands = async (req, res, next) => {
    try {
        const result = await bulkDeleteBrandsService(req.body.brandIDs, next);
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingBrandIds,
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: `${result.deletedCount} brand deleted successfully`,
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllBrands = async (req, res, next) => {
    try {
        const result = await deleteAllBrandsService();
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: 'No brands deleted, something went wrong',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'All brands deleted successfully',
        });
    } catch (error) {
        // next(error);
    }
};
