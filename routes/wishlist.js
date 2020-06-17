const express = require('express');

const wishlistController = require('../controllers/wishlist');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Add to wishlist
router.post('/addwishlist', authenticate.authenticate, wishlistController.addToWishlist);

// Remove from wishlist
router.post('/removewishlist', authenticate.authenticate, wishlistController.removeFromWishlist);

// Get wishlist
router.get('/getwishlist', authenticate.authenticate, wishlistController.getWishlist);

module.exports = router;