require('dotenv').config(); // Tells our program to load environment variables from a .env file
const Auth = require('../models/User'); // Tells our program how to make, store, and look for users in the database.
const bcrypt = require('bcryptjs'); // Encrypts passwords
const jwt = require('jsonwebtoken'); // To identify an authenticated user using a token

// Signup Controller
// controllers/userController.js
const signupUser = async (req, res) => {
    try {
      // Get Info: Takes the name, email, and password from what the user typed (req.body)
      const { username, email, password } = req.body;
  
      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          fields: {
            username: !username ? 'Username is required' : null,
            email: !email ? 'Email is required' : null,
            password: !password ? 'Password is required' : null
          }
        });
      }
  
      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
  
      // Check for existing username
      const existingUsername = await Auth.findOne({ username: username.trim() });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
  
      // Check for existing email
      const existingEmail = await Auth.findOne({ email: email.toLowerCase().trim() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
  
      // Create new user with sanitized data
      const newUser = new Auth({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: password
      });
  
      await newUser.save();
  
      // Generate JWT token
      // Token that the new user can use to show they’re allowed in.
      const token = jwt.sign( { userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' } );
  

      // Set cookie
      // The token is put in a cookie (a tiny storage place in the browser) so that the user stays logged in for the specified time frame.
      res.cookie('wahome', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
        // secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        newUser,
      });
  
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
      }
  
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        });
      }
  
      console.error('Signup Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during signup'
      });
    }
  };

// LOG IN controller
const loginUser = async (req, res) => {
  try {
    // Get Info: Takes the email and password from the user’s input.
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        fields: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user by email
    const user = await Auth.findOne({ email: email.toLowerCase().trim() });
    
    // If user doesn't exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    // Set cookie
    res.cookie('wahome', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
      sameSite: 'lax',

    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};


// LOG OUT controller
const logoutUser = async (req, res) => {
  try {
    res.cookie('wahome', '', {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};



module.exports = { signupUser, loginUser, logoutUser }