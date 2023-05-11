const express = require('express');
const SupplierController = require('../../controllers/Supplier.controller');

const router = express.Router();

router.route('/:supplierId').get(SupplierController.getSpecificSupplierById);

router.route('/').get(SupplierController.getAllSuppliers).post(SupplierController.addANewSupplier);

module.exports = router;
