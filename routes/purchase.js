const express = require('express');

const purchaseController = require('../controllers/purchase');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Add to purchases
router.post('/addpurchase', authenticate.authenticate, purchaseController.addToPurchases);

// Get purchases
router.get('/getpurchase', authenticate.authenticate, purchaseController.getPurchases);

module.exports = router;