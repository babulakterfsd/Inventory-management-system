const {
    getAllCategoryService,
    addANewCategoryService,
    getSpecificCategoryByIdService,
    updateCategoryByIdService,
    deleteCategoryByIdService,
    bulkUpdateCategoryService,
    bulkDeleteCategoryService,
    deleteAllCategoryService,
} = require('../services/Category.services');

module.exports.getAllCategory = async (req, res, next) => {
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

        const { category, totalCategory, pageCount } = await getAllCategoryService(
            filters,
            queries
        );

        if (category.length > 0) {
            res.status(200).json({
                status: 'success',
                data: category,
                totalCategory,
                pageCount,
                message: 'Category fetched successfully',
            });
        }
        if (category.length === 0) {
            res.status(200).json({
                status: 'success',
                totalCategory,
                pageCount,
                message:
                    'Request processed successfully but no category found. Check your query parameters and try again.',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.addANewCategory = async (req, res, next) => {
    try {
        const savedCategory = await addANewCategoryService(req.body);
        res.status(201).json({
            status: 'success',
            data: savedCategory,
            message: 'Category created successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSpecificCategoryById = async (req, res, next) => {
    try {
        const category = await getSpecificCategoryByIdService(req.params.categoryId);
        res.status(200).json({
            status: 'success',
            data: category,
            message: 'Category fetched successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.updateCategoryById = async (req, res, next) => {
    try {
        await updateCategoryByIdService(req.params.categoryId, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Category updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteCategoryById = async (req, res, next) => {
    try {
        await deleteCategoryByIdService(req.params.categoryId);
        res.status(200).json({
            status: 'success',
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.bulkUpdateCategory = async (req, res, next) => {
    try {
        const result = await bulkUpdateCategoryService(req.body.categories);
        if (result.modifiedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingCategoryIds,
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

module.exports.bulkDeleteCategory = async (req, res, next) => {
    try {
        const result = await bulkDeleteCategoryService(req.body.categoryIDs, next);
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: result.message,
                missingIDs: result.missingCategoryIds,
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: `${result.deletedCount} category deleted successfully`,
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllCategory = async (req, res, next) => {
    try {
        const result = await deleteAllCategoryService();
        if (result.deletedCount === 0) {
            res.status(400).json({
                status: 'fail',
                message: 'No category deleted, something went wrong',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'All categories deleted successfully',
        });
    } catch (error) {
        // next(error);
    }
};
