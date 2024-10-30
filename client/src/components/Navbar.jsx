// components/Navbar.js
import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1><a href="/">Remotivity</a></h1>
      <div className="nav-items">
        <a href="/tasks">Tasks</a>
        <a href="/timelogs">Time Logs</a>
        <a href="/charts">Charts</a>
        <a href="/sign-up">Sign-Up</a>
        <a href="/log-in">Log-In</a>
      </div>
    </nav>
  );
}

export default Navbar;
