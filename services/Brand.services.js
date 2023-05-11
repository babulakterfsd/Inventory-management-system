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
    const brand = await Brand.findById(brandId).select(
        '-products -__v -suppliers -createdAt -updatedAt -_id'
    );
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
