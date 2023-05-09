const express = require('express');
const ProductController = require('../../controllers/Product.controller');

const router = express.Router();

router.route('/').get(ProductController.getAllProducts).post(ProductController.addANewProduct);

router.route('/bulk-update').patch(ProductController.bulkUpdateProducts);

// ei dynamic route ta shobar niche deyar karon holo, jodi eta upore thake tahole / er pore jai dei na keno se setake dynamic id hishebe dhore nibe, even oi bulk-update route tao. ar eta ke shobar niche dile tkhn upore jkhn exact match hobe kono route , tkhn direct oi route e hit hobe, na pele dynamic id, r tao na pele error handling jevabe houar sevabe hbe
router
    .route('/:productId')
    .get(ProductController.getSpecificProductById)
    .patch(ProductController.updateProductById)
    .delete(ProductController.deleteProductById);

module.exports = router;
