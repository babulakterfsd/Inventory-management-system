/* eslint-disable no-underscore-dangle */
const Brand = require('../models/Brand.model');

module.exports.getAllBrandsService = async (filters, queries) => {
    const brands = await Brand.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(queries.sortBy)
        .select(queries.fields);
    const totalBrands = await Brand.countDocuments(filters);
    const pageCount = Math.ceil(totalBrands / queries.limit);
    return {
        brands,
        totalBrands,
        pageCount,
    };
};

module.exports.addANewBrandService = async (data) => {
    const brand = new Brand(data);
    const savedBrand = await brand.save();
    savedBrand.logger();
    return savedBrand;
};

module.exports.getSpecificBrandByIdService = async (brandId) => {
    const brand = await Brand.findById(brandId).populate({
        path: 'products',
        select: 'name -_id',
    });
    // populate kora maane hocche brand er products er moddhe products er details gula include kora. jemon, brand er products er moddhe 5 ta product ache. populate korle, brand er products er moddhe 5 ta product er details gula sompurno pathiye dibe. sudhu id gula, prottekta product er details dibe
    if (!brand) {
        throw new Error('No brand found with that ID');
    } else {
        return brand;
    }
};

module.exports.updateBrandByIdService = async (brandId, data) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
        throw new Error('No brand found with that ID');
    } else {
        await Brand.updateOne(
            { _id: brandId },
            { $set: data },
            {
                runValidators: true,
            }
        );
    }
};

module.exports.deleteBrandByIdService = async (brandId) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
        throw new Error('No brand found with that ID');
    } else {
        await Brand.deleteOne({ _id: brandId });
    }
};

module.exports.bulkUpdateBrandsService = async (brandsToBeUpdated) => {
    const existingBrands = await Brand.find({
        _id: { $in: brandsToBeUpdated.map((brand) => brand.id) },
    });
    const existingBrandIds = existingBrands.map((brand) => brand._id.toString());
    const missingBrandIds = brandsToBeUpdated
        .filter((brand) => !existingBrandIds.includes(brand.id))
        .map((brand) => brand.id);

    if (missingBrandIds.length === 0) {
        const updatePromises = brandsToBeUpdated.map((brand) =>
            Brand.updateOne({ _id: brand.id }, { $set: brand.data }, { runValidators: true })
        );

        const updateResults = await Promise.all(updatePromises);
        const modifiedCount = updateResults.reduce((total, res) => total + res.nModified, 0);

        return { modifiedCount, message: ` ${updatePromises.length} brand updated successfully` };
    }

    return {
        modifiedCount: 0,
        message:
            'One or more brands not found with the given IDs. No brands updated. Check IDs and try again.',
        missingBrandIds,
    };
};

module.exports.bulkDeleteBrandsService = async (IDsArray, next) => {
    let result = {};
    try {
        // Check if all brand IDs exist
        const existingBrands = await Brand.find({ _id: { $in: IDsArray } });
        const existingBrandIds = existingBrands.map((brand) => brand._id.toString());
        const missingBrandIds = IDsArray.filter((brandId) => !existingBrandIds.includes(brandId));

        const isValidToDelete = IDsArray.every((brandId) => existingBrandIds.includes(brandId));

        if (isValidToDelete) {
            result = await Brand.deleteMany({ _id: { $in: IDsArray } });
            return result;
        }
        return {
            deletedCount: 0,
            message: `One or more brands not found with the given IDs. No brands deleted. Check IDs and try again.`,
            missingBrandIds,
        };
    } catch (error) {
        next(error);
    }
};

module.exports.deleteAllBrandsService = async () => {
    const result = await Brand.deleteMany({});
    return result;
};
