const {
    getAllStoreService,
    addANewStoreService,
    getSpecificStoreByIdService,
} = require('../services/Store.services');

module.exports.getAllStore = async (req, res, next) => {
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

        const { stores, totalStore, pageCount } = await getAllStoreService(filters, queries);

        if (stores.length > 0) {
            res.status(200).json({
                status: 'success',
                data: stores,
                totalStore,
                pageCount,
                message: 'Store fetched successfully',
            });
        }
        if (stores.length === 0) {
            res.status(200).json({
                status: 'success',
                totalStore,
                pageCount,
                message:
                    'Request processed successfully but no store found. Check your query parameters and try again.',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.addANewStore = async (req, res, next) => {
    try {
        const savedStore = await addANewStoreService(req.body);
        res.status(201).json({
            status: 'success',
            data: savedStore,
            message: 'Store created successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSpecificStoreById = async (req, res, next) => {
    try {
        const store = await getSpecificStoreByIdService(req.params.storeId);
        res.status(200).json({
            status: 'success',
            data: store,
            message: 'Store fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};
