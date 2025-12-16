import React, { act } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock tasks data
const mockTasks = [
  { 
    id: 1, 
    title: 'Buy groceries for the week', 
    due_date: '2025-12-18',
    completed: 0,
    created_at: '2025-12-16T00:00:00.000Z',
    updated_at: '2025-12-16T00:00:00.000Z'
  },
  { 
    id: 2, 
    title: 'Finish project report', 
    due_date: '2025-12-20',
    completed: 0,
    created_at: '2025-12-16T00:00:00.000Z',
    updated_at: '2025-12-16T00:00:00.000Z'
  },
];

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/tasks handler
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockTasks)
    );
  }),
  
  // POST /api/tasks handler
  rest.post('/api/tasks', (req, res, ctx) => {
    const { title, due_date } = req.body;
    
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Task title is required and must be a non-empty string' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title: title.trim(),
        due_date: due_date || null,
        completed: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  }),

  // PUT /api/tasks/:id handler
  rest.put('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const { title, due_date } = req.body;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        title: title.trim(),
        due_date: due_date || null,
        completed: 0,
        created_at: '2025-12-16T00:00:00.000Z',
        updated_at: new Date().toISOString(),
      })
    );
  }),

  // PATCH /api/tasks/:id/complete handler
  rest.patch('/api/tasks/:id/complete', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        title: 'Test Task',
        due_date: null,
        completed: 1,
        created_at: '2025-12-16T00:00:00.000Z',
        updated_at: new Date().toISOString(),
      })
    );
  }),

  // DELETE /api/tasks/:id handler
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Task deleted successfully', id: parseInt(id) })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component - Integration Tests', () => {
  test('renders the header with magical theme', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/My Magical Tasks/)).toBeInTheDocument();
    expect(screen.getByText(/Keep track of your tasks in style!/)).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Buy groceries for the week')).toBeInTheDocument();
      expect(screen.getByText('Finish project report')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText(/Loading your magical tasks/)).toBeInTheDocument();
  });

  test('adds a new task with title only', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText(/What magical task/);
    await act(async () => {
      await user.type(input, 'New Test Task');
    });
    
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new task appears
    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });

  test('adds a new task with title and due date', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });
    
    // Fill in the form
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');
    
    await act(async () => {
      await user.type(titleInput, 'Task with Date');
      if (dateInput) {
        fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
      }
    });
    
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new task appears
    await waitFor(() => {
      expect(screen.getByText('Task with Date')).toBeInTheDocument();
    });
  });

  test('deletes a task', async () => {
    window.confirm = jest.fn(() => true);
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Buy groceries for the week')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButtons = screen.getAllByText(/Delete/);
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
    
    // Check that confirm was called
    expect(window.confirm).toHaveBeenCalled();
  });

  test('toggles task completion', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Buy groceries for the week')).toBeInTheDocument();
    });
    
    // Click complete button
    const completeButtons = screen.getAllByText(/Complete/);
    await act(async () => {
      fireEvent.click(completeButtons[0]);
    });
    
    // Task should be updated
    await waitFor(() => {
      expect(completeButtons[0]).toBeInTheDocument();
    });
  });

  test('handles API error when fetching tasks', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText(/No tasks yet!/)).toBeInTheDocument();
      expect(screen.getByText(/Add your first magical task/)).toBeInTheDocument();
    });
  });

  test('handles error when adding task fails', async () => {
    const user = userEvent.setup();
    
    // Override the POST handler to simulate an error
    server.use(
      rest.post('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ error: 'Task title is required' }));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });
    
    // Try to add a task
    const input = screen.getByPlaceholderText(/What magical task/);
    await act(async () => {
      await user.type(input, 'Test');
    });
    
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Error adding task/)).toBeInTheDocument();
    });
  });
});