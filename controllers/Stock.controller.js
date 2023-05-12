const {
    getAllStockService,
    addANewStockService,
    getSpecificStockByIdService,
    updateStockByIdService,
    deleteStockByIdService,
    bulkUpdateStockService,
    bulkDeleteStockService,
    deleteAllStockService,
} = require('../services/Stock.services');

module.exports.getAllStocks = async (req, res, next) => {
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

        const { stocks, totalStocks, pageCount } = await getAllStockService(filters, queries);

        if (stocks.length > 0) {
            res.status(200).json({
                status: 'success',
                data: stocks,
                totalStocks,
                pageCount,
                message: 'Stock fetched successfully',
            });
        }
        if (stocks.length === 0) {
            res.status(200).json({
                status: 'success',
                totalStocks,
                pageCount,
                message:
                    'Request processed successfully but no stocks found. Check your query parameters and try again.',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.addANewStock = async (req, res, next) => {
    try {
        const savedStock = await addANewStockService(req.body);
        res.status(201).json({
            status: 'success',
            data: savedStock,
            message: 'Stock created successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSpecificStockById = async (req, res, next) => {
    try {
        const stock = await getSpecificStockByIdService(req.params.stockId);
        res.status(200).json({
            status: 'success',
            data: stock,
            message: 'Stock fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.updateStockById = async (req, res, next) => {
    try {
        await updateStockByIdService(req.params.stockId, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Stock updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteStockById = async (req, res, next) => {
    try {
        await deleteStockByIdService(req.params.stockId);
        res.status(200).json({
            status: 'success',
            message: 'Stock deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.bulkUpdateStocks = async (req, res, next) => {
    try {
        const result = await bulkUpdateStockService(req.body.stocks);
        if (result.modifiedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingStockIds,
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

module.exports.bulkDeleteStocks = async (req, res, next) => {
    try {
        const result = await bulkDeleteStockService(req.body.stockIDs, next);
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingStockIds,
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: `${result.deletedCount} stock deleted successfully`,
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllStocks = async (req, res, next) => {
    try {
        const result = await deleteAllStockService();
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: 'No stocks deleted, something went wrong',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'All stocks deleted successfully',
        });
    } catch (error) {
        // next(error);
    }
};
