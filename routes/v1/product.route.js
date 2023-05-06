const express = require('express');
const ProductController = require('../../controllers/Product.controller');

const router = express.Router();

router
    .route('/')
    /*
 * @api {get} /api/v1/products  ->  get all products
 * @apiDescription get all products
 * @apiPermission every user
 *
 * @apiHeader {String} Authorization   nothing needed so far cause authentication is not implemented yet

 * @apiSuccess [{}] ->  an array of products
 *
 * @apiError (Unauthorized 401)  Unauthorized  everyone can access the data
 * @apiError (Forbidden 403)     Forbidden     everyone can access the data
 */
    .get(ProductController.getAllProducts)
    /*
 * @api {post} /  ->  add a new product
 * @apiDescription add a new product
 * @apiPermission every user
 *
 * @apiHeader {String} Authorization   nothing needed so far cause authentication is not implemented yet

 * @apiSuccess {} ->  the newly created product with success message
 *
 * @apiError (Unauthorized 401)  Unauthorized  everyone can access the data
 * @apiError (Forbidden 403)     Forbidden     everyone can access the data
 */
    .post(ProductController.addANewProduct);

module.exports = router;
