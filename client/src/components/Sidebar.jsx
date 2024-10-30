// components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <a href="/tasks">📋</a>
      <a href="/timelogs">⏱️</a>
      <a href="/charts">📊</a>
      <a href="/sign-up">🔑</a>
      <a href="/log-in">👤</a>
    </div>
  );
}

export default Sidebar;