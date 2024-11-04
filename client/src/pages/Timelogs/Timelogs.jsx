import { useState, useEffect } from 'react';
import "./Timelogs.css";
import axios from 'axios';

const TimeLogs = () => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task/tasks', { withCredentials: true });
        const data = response.data;

        const transformedLogs = data.tasks.map(task => ({
          id: task._id, 
          day: new Date(task.startTime).toLocaleDateString('en-US', { weekday: 'long' }),
          date: new Date(task.startTime).toLocaleDateString(),
          task: task.name,
          timeLoggedIn: new Date(task.startTime).toLocaleTimeString(),
          timeCompleted: new Date(task.endTime).toLocaleTimeString(),
        }));

        setTimeLogs(transformedLogs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLogs();
  }, []);

  

  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/${id}`, { withCredentials: true });
      setTimeLogs(timeLogs.filter(log => log.id !== id)); 
    } catch (error) {
      console.error("Error deleting task:", error);  // Logs the full error object for debugging
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="time-logs-container">
      <h2>Time Logs</h2>
      <table className="time-logs-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Tasks</th>
            <th>Time Logged In</th>
            <th>Time Completed</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {timeLogs.map(log => (
            <tr key={log.id}>
              <td>{log.day}</td>
              <td>{log.date}</td>
              <td>{log.task}</td>
              <td>{log.timeLoggedIn}</td>
              <td>{log.timeCompleted}</td>
              <td>
                <button onClick={() => handleDelete(log.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogs;
