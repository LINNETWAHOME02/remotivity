import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, deleteTask, completeTask, title }) {
  return (
    <div className="task-list">
      <h3>{title}</h3>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          completeTask={completeTask}
        />
      ))}
    </div>
  );
}

export default TaskList;