const express = require('express');

const authController = require('../controllers/auth');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Signup
router.post('/signup', authController.signupUser);

// Login
router.post('/login', authController.loginUser);

// Logout
router.post('/logout', authenticate.authenticate, authController.logoutUser);

module.exports = router;