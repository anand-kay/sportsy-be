const express = require('express');

const addressController = require('../controllers/address');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Set address
router.post('/setaddress', authenticate.authenticate, addressController.setAddress);

// Get address
router.get('/getaddress', authenticate.authenticate, addressController.getAddress);

module.exports = router;