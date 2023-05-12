const express = require('express');
const StoreController = require('../../controllers/Store.controller');

const router = express.Router();
router.route('/').get(StoreController.getAllStore).post(StoreController.addANewStore);

router.route('/:storeId').get(StoreController.getSpecificStoreById);

module.exports = router;
