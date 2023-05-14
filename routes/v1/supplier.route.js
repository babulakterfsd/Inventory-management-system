const express = require('express');
const SupplierController = require('../../controllers/Supplier.controller');

const router = express.Router();

router.route('/').get(SupplierController.getAllSuppliers).post(SupplierController.addANewSupplier);

router
    .route('/:supplierId')
    .get(SupplierController.getSpecificSupplierById)
    .patch(SupplierController.updateSupplierById)
    .delete(SupplierController.deleteSupplierById);

module.exports = router;
