require('dotenv').config(); 
const Auth = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup Controller
// controllers/userController.js
const signupUser = async (req, res) => {
    try {
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
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
    console.log(token, 'tokenism')

      // Set cookie
      res.cookie('wahome', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
        // secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully'
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
  

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Store token in a cookie
    res.cookie('wahome', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
      // secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error in login', error });
  }
};




exports.loginUser = async (req, res) => {
  try {
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

    console.log(token, 'tokenism')

    // Set cookie
    res.cookie('wahome', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 36000000, // 1 hour
    });

    // Return success response without sensitive data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Add logout functionality
exports.logoutUser = async (req, res) => {
  try {
    res.cookie('wahome', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
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

// Middleware to verify token


module.exports = { signupUser, loginUser }