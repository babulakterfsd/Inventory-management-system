const express = require('express');
const StockController = require('../../controllers/Stock.controller');

const router = express.Router();

router.route('/bulk-update').patch(StockController.bulkUpdateStocks);
router.route('/bulk-delete').delete(StockController.bulkDeleteStocks);
router.route('/delete-all-stock').delete(StockController.deleteAllStocks);

router.route('/').get(StockController.getAllStocks).post(StockController.addANewStock);

// ei dynamic route ta shobar niche deyar karon holo, jodi eta upore thake tahole / er pore jai dei na keno se setake dynamic id hishebe dhore nibe, even oi bulk-update route tao. ar eta ke shobar niche dile tkhn upore jkhn exact match hobe kono route , tkhn direct oi route e hit hobe, na pele dynamic id, r tao na pele error handling jevabe houar sevabe hbe
router
    .route('/:stockId')
    .get(StockController.getSpecificStockById)
    .patch(StockController.updateStockById)
    .delete(StockController.deleteStockById);

module.exports = router;
