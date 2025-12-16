const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialTasks = [
  { title: 'Buy groceries for the week', due_date: '2025-12-18' },
  { title: 'Finish project report', due_date: '2025-12-20' },
  { title: 'Call dentist for appointment', due_date: null }
];

const insertStmt = db.prepare('INSERT INTO tasks (title, due_date) VALUES (?, ?)');

initialTasks.forEach(task => {
  insertStmt.run(task.title, task.due_date);
});

console.log('In-memory database initialized with sample tasks');

/**
 * Validates a task object
 * @param {Object} task - Task object to validate
 * @returns {Object} Validation result with isValid and error properties
 */
function validateTask(task) {
  if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
    return { isValid: false, error: 'Task title is required and must be a non-empty string' };
  }

  if (task.due_date !== null && task.due_date !== undefined) {
    if (typeof task.due_date !== 'string') {
      return { isValid: false, error: 'Due date must be a string in YYYY-MM-DD format' };
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(task.due_date)) {
      return { isValid: false, error: 'Due date must be in YYYY-MM-DD format' };
    }
    
    const date = new Date(task.due_date);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Invalid due date' };
    }
  }

  return { isValid: true };
}

/**
 * Sorts tasks by due date in ascending order
 * Tasks without due dates are placed at the end
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Sorted array of tasks
 */
function sortTasksByDueDate(tasks) {
  return tasks.sort((a, b) => {
    // Tasks without due dates go to the end
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    
    return new Date(a.due_date) - new Date(b.due_date);
  });
}

// API Routes
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    const sortedTasks = sortTasksByDueDate(tasks);
    res.json(sortedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, due_date } = req.body;
    const taskData = { title, due_date: due_date || null };
    
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const stmt = db.prepare('INSERT INTO tasks (title, due_date) VALUES (?, ?)');
    const result = stmt.run(taskData.title.trim(), taskData.due_date);
    const id = result.lastInsertRowid;

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, due_date } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = { title, due_date: due_date || null };
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const stmt = db.prepare(
      'UPDATE tasks SET title = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(taskData.title.trim(), taskData.due_date, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.patch('/api/tasks/:id/complete', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newCompletedStatus = existingTask.completed ? 0 : 1;
    const stmt = db.prepare(
      'UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(newCompletedStatus, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db, validateTask, sortTasksByDueDate };