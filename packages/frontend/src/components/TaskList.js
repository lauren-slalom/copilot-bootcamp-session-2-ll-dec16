import React from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';

/**
 * TaskList component displays a list of tasks
 * @param {Object} props - Component props
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onEditTask - Callback to edit a task
 * @param {Function} props.onToggleComplete - Callback to toggle task completion
 * @param {Function} props.onDeleteTask - Callback to delete a task
 */
function TaskList({ tasks, onEditTask, onToggleComplete, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🦄</div>
        <h2>No tasks yet!</h2>
        <p>Add your first magical task to get started! ✨</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Your Tasks 📋</h2>
      <div className="task-cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
