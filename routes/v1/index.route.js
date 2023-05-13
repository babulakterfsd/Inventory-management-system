const express = require('express');

const router = express.Router();
const indexController = require('../../controllers/index.controller');
const uploader = require('../../middlewares/uploadHandler');

// router.route('/upload-single-file').post(uploader.array('image'), indexController.uploadFile); //for multiple file upload
router.route('/upload-single-file').post(uploader.single('image'), indexController.uploadFile);

router.route('/get-single-file').get(indexController.getSingleFile);

router
    .route('/')
    /*
 * @api {get} /  ->  sends a html file using ejs template engine
 * @apiDescription show a html file using ejs template engine
 * @apiPermission every user
 *
 * @apiHeader {String} Authorization   nothing needed here

 * @apiSuccess home.ejs ->  a html file using ejs template engine
 *
 * @apiError (Unauthorized 401)  Unauthorized  everyone can access the data
 * @apiError (Forbidden 403)     Forbidden     everyone can access the data
 */ .get(indexController.getHomePage);

module.exports = router;
