const express = require('express');
const CategoryController = require('../../controllers/Category.controller');

const router = express.Router();

router.route('/bulk-update').patch(CategoryController.bulkUpdateCategory);
router.route('/bulk-delete').delete(CategoryController.bulkDeleteCategory);
router.route('/delete-all-category').delete(CategoryController.deleteAllCategory);

router.route('/').get(CategoryController.getAllCategory).post(CategoryController.addANewCategory);

router
    .route('/:categoryId')
    .get(CategoryController.getSpecificCategoryById)
    .patch(CategoryController.updateCategoryById)
    .delete(CategoryController.deleteCategoryById);

module.exports = router;
