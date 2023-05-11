const {
    addANewBrandService,
    getAllBrandsService,
    getSpecificBrandByIdService,
    updateBrandByIdService,
    deleteBrandByIdService,
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
