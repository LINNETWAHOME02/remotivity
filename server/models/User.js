// models/User.js
const mongoose = require('mongoose'); // helps us communicate to the database, Mongo DB, where we keep all our tasks
const bcrypt = require('bcryptjs'); // Encrypts passwords


// authSchema - Think of it as a rulebook or template that says what a user data should look like
const authSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // Any whitespaces are removed
    minlength: [3, 'Username must be at least 3 characters long'],
    validate: {
      validator: function(v) {
        return v != null && v.length > 0;
      },
      message: 'Username cannot be null or empty'
    }
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true, // Any whitespaces are removed
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
}, {
  timestamps: true // Add the extra info - createdAt & updatedAt
});

// This part hashes the password before saving it in the database
authSchema.pre('save', async function(next) {
  // Checks if the password was changed.
  if (this.isModified('password')) {
    // Creates a special value (salt) to mix with the password
    const salt = await bcrypt.genSalt(10);

    // Replace the plain password with the hashed one
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// This saves the authSchema under the name Auth, which we can use to manage users in the database
const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;