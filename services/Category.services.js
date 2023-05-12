/* eslint-disable no-underscore-dangle */
const Category = require('../models/Category.model');

module.exports.getAllCategoryService = async (filters, queries) => {
    const category = await Category.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(queries.sortBy)
        .select(queries.fields);
    const totalCategory = await Category.countDocuments(filters);
    const pageCount = Math.ceil(totalCategory / queries.limit);
    return {
        category,
        totalCategory,
        pageCount,
    };
};

module.exports.addANewCategoryService = async (data) => {
    const category = new Category(data);
    const savedCategory = await category.save();
    return savedCategory;
};

module.exports.getSpecificCategoryByIdService = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error('No category found with that ID');
    } else {
        return category;
    }
};

module.exports.updateCategoryByIdService = async (categoryId, data) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error('No category found with that ID');
    } else {
        await Category.updateOne(
            { _id: categoryId },
            { $set: data },
            {
                runValidators: true,
            }
        );
    }
};

module.exports.deleteCategoryByIdService = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error('No category found with that ID');
    } else {
        await Category.deleteOne({ _id: categoryId });
    }
};

module.exports.bulkUpdateCategoryService = async (categoryToBeUpdated) => {
    const existingCategory = await Category.find({
        _id: { $in: categoryToBeUpdated.map((category) => category.id) },
    });
    const existingCategoryIds = existingCategory.map((category) => category._id.toString());
    const missingCategoryIds = categoryToBeUpdated
        .filter((category) => !existingCategoryIds.includes(category.id))
        .map((category) => category.id);

    if (missingCategoryIds.length === 0) {
        const updatePromises = categoryToBeUpdated.map((category) =>
            Category.updateOne(
                { _id: category.id },
                { $set: category.data },
                { runValidators: true }
            )
        );

        const updateResults = await Promise.all(updatePromises);
        const modifiedCount = updateResults.reduce((total, res) => total + res.nModified, 0);

        return {
            modifiedCount,
            message: ` ${updatePromises.length} category updated successfully`,
        };
    }

    return {
        modifiedCount: 0,
        message:
            'One or more categories not found with the given IDs. No category updated. Check IDs and try again.',
        missingCategoryIds,
    };
};

module.exports.bulkDeleteCategoryService = async (IDsArray, next) => {
    let result = {};
    try {
        const existingCategory = await Category.find({ _id: { $in: IDsArray } });
        const existingCategoryIds = existingCategory.map((category) => category._id.toString());
        const missingCategoryIds = IDsArray.filter(
            (categoryId) => !existingCategoryIds.includes(categoryId)
        );

        const isValidToDelete = IDsArray.every((categoryId) =>
            existingCategoryIds.includes(categoryId)
        );

        if (isValidToDelete) {
            result = await Category.deleteMany({ _id: { $in: IDsArray } });
            return result;
        }
        return {
            deletedCount: 0,
            message: `One or more catory not found with the given IDs. No category deleted. Check IDs and try again.`,
            missingCategoryIds,
        };
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllCategoryService = async () => {
    const result = await Category.deleteMany({});
    return result;
};
