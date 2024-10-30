import React from 'react';

function TaskItem({ task, deleteTask, completeTask }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <span>{task.text} - {task.timestamp}</span>
      <button onClick={() => deleteTask(task.id)}>-</button>
      {!task.completed && <button onClick={() => completeTask(task.id)}>✔</button>}
    </div>
  );
}

export default TaskItem;
