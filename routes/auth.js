const express = require('express');
const router = express.Router();
const {register, login, selectRole} = require('../controllers/auth-controller'); // Assuming your controller is named itemController.js



// Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/role', selectRole);

module.exports = router;