import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';

describe('TaskList Component', () => {
  const mockHandlers = {
    onEditTask: jest.fn(),
    onToggleComplete: jest.fn(),
    onDeleteTask: jest.fn()
  };

  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      due_date: '2025-12-20',
      completed: 0,
      created_at: '2025-12-16',
      updated_at: '2025-12-16'
    },
    {
      id: 2,
      title: 'Task 2',
      due_date: null,
      completed: 1,
      created_at: '2025-12-16',
      updated_at: '2025-12-16'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} {...mockHandlers} />);
    
    expect(screen.getByText(/No tasks yet!/)).toBeInTheDocument();
    expect(screen.getByText(/Add your first magical task/)).toBeInTheDocument();
    expect(screen.getByText(/🦄/)).toBeInTheDocument();
  });

  it('renders task list when tasks exist', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText(/Your Tasks/)).toBeInTheDocument();
  });

  it('renders correct number of tasks', () => {
    const { container } = render(<TaskList tasks={mockTasks} {...mockHandlers} />);
    
    const taskCards = container.querySelectorAll('.task-card');
    expect(taskCards.length).toBe(2);
  });

  it('passes handlers to TaskCard components', () => {
    render(<TaskList tasks={mockTasks} {...mockHandlers} />);
    
    const completeButtons = screen.getAllByText(/Complete|Undo/);
    expect(completeButtons.length).toBeGreaterThan(0);
  });
});
