// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";

import TasksPage from "./pages/Tasks/TasksPage";
import Timelogs from "./pages/Timelogs/Timelogs";
import ChartsPage from "./pages/Charts/ChartsPage";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";

import "./App.css";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [timelogData, setTimelogData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from timelog for charts
    const fetchData = async () => {
      const data = [
        { date: "2024-10-28", startTime: "10:00", endTime: "11:30" },
        { date: "2024-10-29", startTime: "09:00", endTime: "11:00" },
        { date: "2024-10-30", startTime: "15:00", endTime: "19:00" },
        { date: "2024-10-31", startTime: "08:00", endTime: "13:00" }
        // Add more entries
      ];
      setTimelogData(data);
    };
    fetchData();
  }, []);

  // Toggle between Navbar and Sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
    <Router>
      <div className="sidebar-or-navbar">
        {showSidebar ? <Sidebar /> : <Navbar />}
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/timelogs" element={<Timelogs />} />
          <Route path="/charts" element={<ChartsPage timelogData={timelogData} />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<LogIn />} />
        </Routes>
      </div>
    </Router>
  </div>
  );
}

export default App;
