const express = require('express');
const { signupUser, loginUser } = require('../controllers/userController');


const router = express.Router();

// Signup route
router.post('/sign-up', signupUser);

// Login route
router.post('/log-in', loginUser);

module.exports = router;