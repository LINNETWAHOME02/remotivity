// App.js
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Timelogs from "./pages/Timelogs/Timelogs";
import ChartsPage from "./pages/Charts/ChartsPage";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import "./App.css";
import TaskInput from "./pages/Tasks/TaskInput";

function App() {
  const [timelogData, setTimelogData] = useState([]);

  useEffect(() => {
    // Fetch timelog data
    const fetchData = async () => {
      const data = [
        { date: "2024-10-28", startTime: "10:00", endTime: "11:30" },
        { date: "2024-10-29", startTime: "09:00", endTime: "11:00" },
        { date: "2024-10-30", startTime: "15:00", endTime: "19:00" },
        { date: "2024-10-31", startTime: "08:00", endTime: "13:00" }
      ];
      setTimelogData(data);
    };
    fetchData();
  }, []);

  

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="container">
         
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tasks" element={<TaskInput />} />
              <Route path="/timelogs" element={<Timelogs />} />
              <Route path="/charts" element={<ChartsPage timelogData={timelogData} />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<LogIn />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
