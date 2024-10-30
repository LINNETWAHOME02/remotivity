import React, { useState, useEffect } from 'react';
import './TimeLogs.css';

const TimeLogs = () => {
  // State to store time logs
  const [timeLogs, setTimeLogs] = useState([]);

  // Function to fetch logs from the database (stubbed for now)
  useEffect(() => {
    // Mock data to simulate fetched time logs
    const fetchedLogs = [
      { day: 'Monday', date: '2024-10-28', task: 'Task 1', timeLoggedIn: '10:00 AM', timeCompleted: '10:30 AM' },
      { day: 'Monday', date: '2024-10-28', task: 'Task 2', timeLoggedIn: '11:00 AM', timeCompleted: '12:00 PM' },
    ];
    setTimeLogs(fetchedLogs);
  }, []);


  // useEffect(() => {
  //   const now = new Date();
  //   const filteredLogs = timeLogs.filter(log => {
  //     const logDate = new Date(log.date + ' ' + log.timeLoggedIn);
  //     return (now - logDate) < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  //   });
  //   setTimeLogs(filteredLogs);
  // }, [timeLogs]);

  // Render the time logs table
  return (
    <div className="time-logs-container">
      <h2>Time Logs Page</h2>
      <table className="time-logs-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Tasks</th>
            <th>Time Logged In</th>
            <th>Time Completed</th>
          </tr>
        </thead>
        <tbody>
          {timeLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.day}</td>
              <td>{log.date}</td>
              <td>{log.task}</td>
              <td>{log.timeLoggedIn}</td>
              <td>{log.timeCompleted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogs;