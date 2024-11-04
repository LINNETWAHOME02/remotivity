const express = require('express'); // helps manage servers and routes
const { signupUser, loginUser, logoutUser } = require('../controllers/userController');


const router = express.Router();

// Signup route
router.post('/sign-up', signupUser);

// Login route
router.post('/log-in', loginUser);

//Log out route
router.post('/logout', logoutUser)

module.exports = router;