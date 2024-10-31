// components/TaskInput.js
import React, { useState } from "react";
import "./TaskInput.css";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic, e.g., save task data
    console.log({ task, description, timeSpent, goal });
    setTask("");
    setDescription("");
    setTimeSpent("");
    setGoal("");
  };

  return (
    <div className="task-input">
      <h2>Log Your Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task name"
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </label>
        <label>
          Time Spent (hrs):
          <input
            type="number"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
            placeholder="0"
          />
        </label>
        <label>
          Daily Goal (hrs):
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., 8"
          />
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskInput;




// import React, { useState } from 'react';

// function TaskInput({ addTask }) {
//   const [taskText, setTaskText] = useState('');

//   const handleAddTask = () => {
//     if (taskText.trim()) {
//       addTask(taskText);
//       setTaskText('');
//     }
//   };

//   return (
//     <div className="task-input">
//       <input
//         type="text"
//         value={taskText}
//         onChange={(e) => setTaskText(e.target.value)}
//         placeholder="What do you intend to do today?"
//       />
//       <button onClick={handleAddTask}>+</button>
//     </div>
//   );
// }

// export default TaskInput;