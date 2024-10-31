const jwt = require('jsonwebtoken');
const Auth = require('../models/User');


const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.wahome;
   console.log(token,'token')
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await Auth.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};



const protect = async (req, res, next) => {
  try {
    const jwt = req.cookies.jwt;
    console.log('Cookies:', req.cookies); // Log cookies to check if the token is present

    if (!jwt) {
      return res.status(401).json({ message: "Not authorized, Please refresh and try to login" });
    }

    const { userId, role } = verifyJWT(jwt);
    req.user = { userId, role };
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    return res.status(500).json({ message: "Authentication failed" });
  }
};

module.exports = {authMiddleware, authenticateToken};