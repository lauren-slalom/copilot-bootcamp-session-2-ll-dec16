import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  let mockOnAddTask;

  beforeEach(() => {
    mockOnAddTask = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with title input and date input', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    expect(screen.getByPlaceholderText(/What magical task/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/ })).toBeInTheDocument();
  });

  it('submits form with title only', async () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith({
        title: 'New Task',
        due_date: null
      });
    });
  });

  it('submits form with title and due date', async () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const dateInput = screen.getByDisplayValue('');
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    
    fireEvent.change(titleInput, { target: { value: 'Task with date' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith({
        title: 'Task with date',
        due_date: '2025-12-25'
      });
    });
  });

  it('clears form after successful submission', async () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
    });
  });

  it('trims whitespace from title', async () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    
    fireEvent.change(titleInput, { target: { value: '  Task with spaces  ' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith({
        title: 'Task with spaces',
        due_date: null
      });
    });
  });

  it('does not submit if title is empty', async () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('disables submit button when title is empty', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when title is filled', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    expect(submitButton).not.toBeDisabled();
  });

  it('shows loading state while submitting', async () => {
    mockOnAddTask = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText(/What magical task/);
    const submitButton = screen.getByRole('button', { name: /Add Task/ });
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Adding.../)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Add Task/)).toBeInTheDocument();
    });
  });
});
