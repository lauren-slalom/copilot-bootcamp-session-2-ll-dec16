import React, { useState } from 'react';
import EditTaskModal from './EditTaskModal';
import './TaskCard.css';

/**
 * Format date to readable string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString + 'T00:00:00');
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Check if a date is overdue
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} True if date is in the past
 */
function isOverdue(dateString) {
  if (!dateString) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dateString + 'T00:00:00');
  return dueDate < today;
}

/**
 * TaskCard component displays a single task
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object
 * @param {Function} props.onEdit - Callback to edit the task
 * @param {Function} props.onToggleComplete - Callback to toggle completion
 * @param {Function} props.onDelete - Callback to delete the task
 */
function TaskCard({ task, onEdit, onToggleComplete, onDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (taskData) => {
    await onEdit(task.id, taskData);
    setIsEditModalOpen(false);
  };

  const handleToggle = () => {
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? 🗑️')) {
      onDelete(task.id);
    }
  };

  const overdue = isOverdue(task.due_date) && !task.completed;
  const cardClass = `task-card ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`;

  return (
    <>
      <div className={cardClass}>
        <div className="task-header">
          <h3 className="task-title">
            {!!task.completed && <span className="completed-icon">✨ </span>}
            {task.title}
          </h3>
          {!!task.completed && <span className="badge completed-badge">Done!</span>}
        </div>
        
        {task.due_date && (
          <div className="task-due-date">
            <span className="date-icon">📅</span>
            <span className="date-text">
              {overdue && <span className="overdue-icon">⏰ </span>}
              Due: {formatDate(task.due_date)}
            </span>
          </div>
        )}
        
        <div className="task-actions">
          <button 
            onClick={handleEdit}
            className="btn btn-edit"
            title="Edit task"
            type="button"
          >
            ✏️ Edit
          </button>
          <button 
            onClick={handleToggle}
            className={`btn ${task.completed ? 'btn-uncomplete' : 'btn-complete'}`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            type="button"
          >
            {task.completed ? '↩️ Undo' : '✅ Complete'}
          </button>
          <button 
            onClick={handleDelete}
            className="btn btn-delete"
            title="Delete task"
            type="button"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}

export default TaskCard;
