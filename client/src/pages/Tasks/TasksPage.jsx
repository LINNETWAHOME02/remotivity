import { useState, useEffect } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import axios from 'axios';

import "./TaskStyles.css";

function TasksPage() {
  const [tasks, setTasks] = useState([]);

  // Add task
  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTasks([...tasks, newTask]);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Complete task
  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="tasks-heading">Tasks</h2>
      <TaskInput addTask={addTask} />
      <div className="task-sections">
        <TaskList
          tasks={tasks.filter((task) => !task.completed)}
          deleteTask={deleteTask}
          completeTask={completeTask}
          title="Added Tasks"
        />
        <TaskList
          tasks={tasks.filter((task) => task.completed)}
          deleteTask={deleteTask}
          title="Completed Tasks"
        />
      </div>
    </div>
  );
}

export default TasksPage;
