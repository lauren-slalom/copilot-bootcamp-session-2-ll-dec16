import React, { useState } from 'react';
import './EditTaskModal.css';

/**
 * EditTaskModal component for editing existing tasks
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object to edit
 * @param {Function} props.onSave - Callback to save the edited task
 * @param {Function} props.onClose - Callback to close the modal
 */
function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave({
        title: title.trim(),
        due_date: dueDate || null,
      });
    } catch (error) {
      console.error('Error saving task:', error);
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Task ✏️</h2>
          <button 
            onClick={onClose}
            className="modal-close"
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-title">Task Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task-input"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-due-date">Due Date</label>
            <div className="date-input-wrapper">
              <span className="date-icon">📅</span>
              <input
                id="edit-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-input"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-save"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? 'Saving... 🌈' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
