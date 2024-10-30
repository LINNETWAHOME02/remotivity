// SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Importing the CSS file for styling

function SignUp() {
  // Define state variables for each form field
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Handle form input changes by updating the respective state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (for now, just logging to console)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/sign-up', { email, password });
      console.log(response.data.message); // Success message
    } catch (error) {
      console.error('Error signing up:', error.response.data.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
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