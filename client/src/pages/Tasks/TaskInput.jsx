import { useState } from "react";
import axios from "axios";
import "./TaskInput.css";
import { useNavigate } from "react-router-dom";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(endTime) <= new Date(startTime)) {
      setError("End time must be after start time.");
      return;
    }

    const taskData = {
      name: task,
      description,
      startTime,
      endTime,
    };

    try {
      setIsLoading(true);
      console.log(taskData, "task");

      const response = await axios.post(
        "http://localhost:5000/api/task/create",
        taskData,
        { withCredentials: true }
      );

      console.log(response.data);
      setSuccessMessage("Task created successfully!");
      setTask("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      navigate('/timelogs')
    } catch (error) {
      console.error("Error creating task:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-input">
      <div className="log-your-task">Log Your Task</div>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task name"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            required
          />
        </label>
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskInput;
