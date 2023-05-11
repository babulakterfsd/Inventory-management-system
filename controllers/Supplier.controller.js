const {
    getAllSuppliersService,
    addANewSupplierService,
    getSpecificSupplierByIdService,
} = require('../services/Supplier.services');

module.exports.getAllSuppliers = async (req, res, next) => {
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

        const { suppliers, totalSuppliers, pageCount } = await getAllSuppliersService(
            filters,
            queries
        );

        if (suppliers.length > 0) {
            res.status(200).json({
                status: 'success',
                data: suppliers,
                totalSuppliers,
                pageCount,
                message: 'Supplier fetched successfully',
            });
        }
        if (suppliers.length === 0) {
            res.status(200).json({
                status: 'success',
                totalSuppliers,
                pageCount,
                message:
                    'Request processed successfully but no suppliers found. Check your query parameters and try again.',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.addANewSupplier = async (req, res, next) => {
    try {
        const savedSupplier = await addANewSupplierService(req.body);
        res.status(201).json({
            status: 'success',
            data: savedSupplier,
            message: 'Supplier created successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSpecificSupplierById = async (req, res, next) => {
    try {
        const supplier = await getSpecificSupplierByIdService(req.params.supplierId);
        res.status(200).json({
            status: 'success',
            data: supplier,
            message: 'Supplier fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};
