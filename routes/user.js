const express = require('express');

const userController = require('../controllers/user');
const authenticate = require('../authentication/authenticate');

const router = express.Router();

// Get user
router.get('/user', authenticate.authenticate, userController.getUser);

module.exports = router;