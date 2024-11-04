const jwt = require('jsonwebtoken'); // To identify an authenticated user using a token
const Auth = require('../models/User'); // Tells our program how to make, store, and look for users in the database.

// Checks if someone has the right token (a pass) to use the service
const authMiddleware = (req, res, next) => {
  // Look for a Token: Checks if there’s a token (a secret pass) in the person’s authorization header
  const token = req.headers['authorization'];
  
  // If there’s no token, it says: "No token provided" and stops the person from going further (res.status(401))
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Verify the Token: It uses jwt.verify to check if the token is real and hasn’t been tampered with.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    // If the token is good, it gets the userId from the token and adds it to req (like writing the person’s ID on a note).
    req.userId = decoded.userId;
 
    // Move to the Next Step: If all checks are fine, it calls next() to let the person continue
    next();
  
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


// Similar function but checks the token from a cookie instead of a header - Cookie based authentication method
// The cookie is used to transmit the token between the client and the server
const authenticateToken = async (req, res, next) => {
  try{
   // Look for a Token in Cookies: It checks if there’s a token (wahome) in the cookies
    const token = req.cookies.wahome;

    // If no token, its response is: "Authentication required" and stops the process with a status code of 401
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify the Token: Just like before, it checks if the token is good
    // JWT_SECRET is contained/defined in the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the User: After verifying the token, it looks in the user book (Auth.findById) for a person with the matching userId from the token
    const user = await Auth.findById(decoded.userId).select('-password');
    
    // If no matching user is found, it responds with a status code of 401 with the message 'User not found'
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach User Info: If the user is found, it attaches their info to req.user (like sticking their details to the note) and calls next() to let them continue
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




module.exports = {authMiddleware, authenticateToken};