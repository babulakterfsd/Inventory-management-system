/* eslint-disable no-underscore-dangle */
const Stock = require('../models/Stock.model');

module.exports.getAllStockService = async (filters, queries) => {
    const stocks = await Stock.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(queries.sortBy)
        .select(queries.fields);
    const totalStocks = await Stock.countDocuments(filters);
    const pageCount = Math.ceil(totalStocks / queries.limit);
    return {
        stocks,
        totalStocks,
        pageCount,
    };
};

module.exports.addANewStockService = async (data) => {
    const stock = new Stock(data);
    const savedStock = await stock.save();
    return savedStock;
};

module.exports.getSpecificStockByIdService = async (stockId) => {
    const stock = await Stock.findById(stockId);
    if (!stock) {
        throw new Error('No stock found with that ID');
    } else {
        return stock;
    }
};

module.exports.updateStockByIdService = async (stockId, data) => {
    const stock = await Stock.findById(stockId);
    if (!stock) {
        throw new Error('No stock found with that ID');
    } else {
        await Stock.updateOne(
            { _id: stockId },
            { $set: data },
            {
                runValidators: true,
            }
        );
    }
};

module.exports.deleteStockByIdService = async (stockId) => {
    const stock = await Stock.findById(stockId);
    if (!stock) {
        throw new Error('No stock found with that ID');
    } else {
        await Stock.deleteOne({ _id: stockId });
    }
};

module.exports.bulkUpdateStockService = async (stocksToBeUpdated) => {
    const existingStocks = await Stock.find({
        _id: { $in: stocksToBeUpdated.map((stock) => stock.id) },
    });
    const existingStockIds = existingStocks.map((stock) => stock._id.toString());
    const missingStockIds = stocksToBeUpdated
        .filter((stock) => !existingStockIds.includes(stock.id))
        .map((stock) => stock.id);

    if (missingStockIds.length === 0) {
        const updatePromises = stocksToBeUpdated.map((stock) =>
            Stock.updateOne({ _id: stock.id }, { $set: stock.data }, { runValidators: true })
        );

        const updateResults = await Promise.all(updatePromises);
        const modifiedCount = updateResults.reduce((total, res) => total + res.nModified, 0);

        return { modifiedCount, message: ` ${updatePromises.length} stock updated successfully` };
    }

    return {
        modifiedCount: 0,
        message:
            'One or more stocks not found with the given IDs. No stocks updated. Check IDs and try again.',
        missingStockIds,
    };
};

module.exports.bulkDeleteStockService = async (IDsArray, next) => {
    let result = {};
    try {
        // Check if all stock IDs exist
        const existingStocks = await Stock.find({ _id: { $in: IDsArray } });
        const existingStockIds = existingStocks.map((stock) => stock._id.toString());
        const missingStockIds = IDsArray.filter((stockId) => !existingStockIds.includes(stockId));

        const isValidToDelete = IDsArray.every((stockId) => existingStockIds.includes(stockId));

        if (isValidToDelete) {
            result = await Stock.deleteMany({ _id: { $in: IDsArray } });
            return result;
        }
        return {
            deletedCount: 0,
            message: `One or more stocks not found with the given IDs. No stocks deleted. Check IDs and try again.`,
            missingStockIds,
        };
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllStockService = async () => {
    const result = await Stock.deleteMany({});
    return result;
};
