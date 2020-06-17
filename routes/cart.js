const express = require('express');

const cartController = require('../controllers/cart');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Add product to cart
router.post('/addcart', authenticate.authenticate, cartController.addToCart);

// Edit quantity in cart
router.post('/editcart', authenticate.authenticate, cartController.editCart);

// Remove product from cart
router.post('/removecart', authenticate.authenticate, cartController.removeFromCart);

// Get cart
router.get('/getcart', authenticate.authenticate, cartController.getCart);

module.exports = router;