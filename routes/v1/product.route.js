const express = require('express');
const ProductController = require('../../controllers/Product.controller');

const router = express.Router();

router.route('/').get(ProductController.getAllProducts).post(ProductController.addANewProduct);

router
    .route('/:productId')
    .get(ProductController.getSpecificProductById)
    .patch(ProductController.updateProductById)
    .delete(ProductController.deleteProductById);

module.exports = router;
