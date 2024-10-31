// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './LogIn.css'; // Importing the CSS file for styling

function LogIn() {
  // State variables for form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pass the email and password directly
      const response = await axios.post('http://localhost:5000/api/auth/log-in', { email, password }, { withCredentials: true });
      
      // Store the token in localStorage if needed
      localStorage.setItem('token', response.data.token);
      
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        {/* Password input */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        {/* Submit button */}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LogIn;
