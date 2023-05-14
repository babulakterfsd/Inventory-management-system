const express = require('express');
const SupplierController = require('../../controllers/Supplier.controller');
const { authorization } = require('../../middlewares/authorization');
const { verifyToken } = require('../../middlewares/verifyToken');

const router = express.Router();

router.route('/').get(SupplierController.getAllSuppliers).post(SupplierController.addANewSupplier);

router
    .route('/:supplierId')
    .get(
        verifyToken,
        authorization('admin', 'store-manager'),
        SupplierController.getSpecificSupplierById
    ) // admin ar store manager chara keu specific kono supplier er information dekhte parbe na, etai authorization middleware er kaj
    .patch(SupplierController.updateSupplierById)
    .delete(SupplierController.deleteSupplierById);

module.exports = router;
