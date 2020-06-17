const express = require('express');

const paymentController = require('../controllers/payment');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Make payment
router.post('/payment', authenticate.authenticate, paymentController.makePayment);

module.exports = router;