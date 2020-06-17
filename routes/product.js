const express = require('express');

const productController = require('../controllers/product');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Add new product to the database
router.post('/newproduct', productController.newProduct);

// Add a review for a product
router.post('/newreview', authenticate.authenticate, productController.newReview);

// Get products by category
router.get('/getcategory', productController.getByCategory);

// Get products by sub-category
router.get('/getsubcategory', productController.getBySubcategory);

// Get products by search
router.get('/getsearch', productController.getBySearch);

// Get recently viewed products (Responds with recents if more than 4 recents exist, or random badminton products otherwise)
router.get('/getrecent', productController.getByRecent);

// Get recommended products
router.get('/getrecommended', productController.getByRecommended);

// Get featured products
router.get('/getfeatured', productController.getByFeatured);

// Get one product
router.get('/product/:prodid', productController.getProduct);

module.exports = router;