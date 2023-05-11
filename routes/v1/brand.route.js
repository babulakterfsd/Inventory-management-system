const express = require('express');
const BrandController = require('../../controllers/Brand.controller');

const router = express.Router();

router.route('/bulk-update').patch(BrandController.bulkUpdateBrands);
router.route('/bulk-delete').delete(BrandController.bulkDeleteBrands);
router.route('/delete-all-brand').delete(BrandController.deleteAllBrands);

router.route('/').get(BrandController.getAllBrands).post(BrandController.addANewBrand);

router
    .route('/:brandId')
    .get(BrandController.getSpecificBrandById)
    .patch(BrandController.updateBrandById)
    .delete(BrandController.deleteBrandById);

module.exports = router;
