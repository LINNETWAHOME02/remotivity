// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './LogIn.css'; 
import { useNavigate } from 'react-router-dom';
function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/log-in', { email, password }, { withCredentials: true });
      
      const newUser = response.data.user;
      if (newUser) {
        localStorage.setItem('dataUser', JSON.stringify(newUser));
      }

      // Navigate to tasks page
      navigate('/tasks')
      
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LogIn;
