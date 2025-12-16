import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard';

describe('TaskCard Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    due_date: '2025-12-25',
    completed: 0,
    created_at: '2025-12-16',
    updated_at: '2025-12-16'
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onToggleComplete: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task title', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders due date when provided', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    expect(screen.getByText(/Dec 25, 2025/)).toBeInTheDocument();
  });

  it('does not render due date when not provided', () => {
    const taskWithoutDate = { ...mockTask, due_date: null };
    render(<TaskCard task={taskWithoutDate} {...mockHandlers} />);
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    const editButton = screen.getByText(/Edit/);
    fireEvent.click(editButton);
    expect(mockHandlers.onEdit).not.toHaveBeenCalled(); // Opens modal first
  });

  it('calls onToggleComplete when complete button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    const completeButton = screen.getByText(/Complete/);
    fireEvent.click(completeButton);
    expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('shows delete confirmation when delete button is clicked', () => {
    window.confirm = jest.fn(() => true);
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    const deleteButton = screen.getByText(/Delete/);
    fireEvent.click(deleteButton);
    expect(window.confirm).toHaveBeenCalled();
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('does not delete when confirmation is cancelled', () => {
    window.confirm = jest.fn(() => false);
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    const deleteButton = screen.getByText(/Delete/);
    fireEvent.click(deleteButton);
    expect(window.confirm).toHaveBeenCalled();
    expect(mockHandlers.onDelete).not.toHaveBeenCalled();
  });

  it('shows completed badge when task is completed', () => {
    const completedTask = { ...mockTask, completed: 1 };
    render(<TaskCard task={completedTask} {...mockHandlers} />);
    expect(screen.getByText(/Done!/)).toBeInTheDocument();
  });

  it('shows undo button when task is completed', () => {
    const completedTask = { ...mockTask, completed: 1 };
    render(<TaskCard task={completedTask} {...mockHandlers} />);
    expect(screen.getByText(/Undo/)).toBeInTheDocument();
  });

  it('applies overdue styling for past due dates', () => {
    const overdueTask = { ...mockTask, due_date: '2020-01-01' };
    const { container } = render(<TaskCard task={overdueTask} {...mockHandlers} />);
    expect(container.querySelector('.overdue')).toBeInTheDocument();
  });

  it('shows overdue icon for past due dates', () => {
    const overdueTask = { ...mockTask, due_date: '2020-01-01' };
    render(<TaskCard task={overdueTask} {...mockHandlers} />);
    expect(screen.getByText(/⏰/)).toBeInTheDocument();
  });
});
