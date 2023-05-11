const express = require('express');
const BrandController = require('../../controllers/Brand.controller');

const router = express.Router();

router.route('/').get(BrandController.getAllBrands).post(BrandController.addANewBrand);

router.route('/:brandId').get(BrandController.getSpecificBrandById);

module.exports = router;
