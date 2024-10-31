// SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Importing the CSS file for styling
import { useNavigate } from 'react-router-dom';

function SignUp() {
  // Define state variables for each form field
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // Handle form input changes by updating the respective state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (for now, just logging to console)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send formData object in the request
      await axios.post('http://localhost:5000/api/auth/sign-up', formData, { withCredentials: true });
      navigate('/tasks')
      
    } catch (error) {
      console.error('Error signing up:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <label htmlFor="name">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Email input */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password input */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Submit button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
