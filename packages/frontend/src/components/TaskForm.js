import React, { useState } from 'react';
import './TaskForm.css';

/**
 * TaskForm component for adding new tasks
 * @param {Object} props - Component props
 * @param {Function} props.onAddTask - Callback to add a new task
 */
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddTask({
        title: title.trim(),
        due_date: dueDate || null,
      });
      
      // Clear form on success
      setTitle('');
      setDueDate('');
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error in TaskForm:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Add New Task 🎀</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What magical task will you complete today? ✨"
            className="task-input"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <div className="date-input-wrapper">
            <span className="date-icon">📅</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-add"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Adding... 🌈' : '➕ Add Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
