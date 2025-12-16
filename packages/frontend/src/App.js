import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTasks(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      await fetchTasks(); // Refresh to get sorted list
      setError(null);
      return newTask;
    } catch (err) {
      setError('Error adding task: ' + err.message);
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const handleEditTask = async (taskId, taskData) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      await fetchTasks(); // Refresh to get sorted list
      setError(null);
      return updatedTask;
    } catch (err) {
      setError('Error updating task: ' + err.message);
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle task completion');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      setError(null);
    } catch (err) {
      setError('Error toggling task: ' + err.message);
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🦄 My Magical Tasks</h1>
        <p>Keep track of your tasks in style! ✨</p>
      </header>

      <main className="App-main">
        <TaskForm onAddTask={handleAddTask} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading your magical tasks... 🌈</div>
        ) : (
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;