import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTaskModal from '../EditTaskModal';

describe('EditTaskModal Component', () => {
  const mockTask = {
    id: 1,
    title: 'Original Task',
    due_date: '2025-12-20',
    completed: 0,
    created_at: '2025-12-16',
    updated_at: '2025-12-16'
  };

  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with task data', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByDisplayValue('Original Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-12-20')).toBeInTheDocument();
  });

  it('renders modal header', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Edit Task/)).toBeInTheDocument();
  });

  it('allows editing task title', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const titleInput = screen.getByDisplayValue('Original Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    
    expect(titleInput.value).toBe('Updated Task');
  });

  it('allows editing due date', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const dateInput = screen.getByDisplayValue('2025-12-20');
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    
    expect(dateInput.value).toBe('2025-12-25');
  });

  it('calls onSave with updated data when form is submitted', async () => {
    mockOnSave.mockResolvedValue({});
    
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const titleInput = screen.getByDisplayValue('Original Task');
    const saveButton = screen.getByText(/Save Changes/);

    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Updated Task',
        due_date: '2025-12-20'
      });
    });
  });

  it('trims whitespace from title when saving', async () => {
    mockOnSave.mockResolvedValue({});
    
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const titleInput = screen.getByDisplayValue('Original Task');
    const saveButton = screen.getByText(/Save Changes/);

    fireEvent.change(titleInput, { target: { value: '  Task with spaces  ' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Task with spaces',
        due_date: '2025-12-20'
      });
    });
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText(/Cancel/);
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking overlay', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const overlay = screen.getByText(/Edit Task/).closest('.modal-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not close when clicking modal content', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const modalContent = screen.getByText(/Edit Task/).closest('.modal-content');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('disables save button when title is empty', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const titleInput = screen.getByDisplayValue('Original Task');
    const saveButton = screen.getByText(/Save Changes/);

    fireEvent.change(titleInput, { target: { value: '' } });
    
    expect(saveButton).toBeDisabled();
  });

  it('shows loading state while submitting', async () => {
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const saveButton = screen.getByText(/Save Changes/);
    fireEvent.click(saveButton);

    // While saving, button should show "Saving..."
    expect(screen.getByText(/Saving.../)).toBeInTheDocument();
    
    // Wait for the save to complete
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    }, { timeout: 200 });
  });

  it('handles task without due date', () => {
    const taskWithoutDate = { ...mockTask, due_date: null };
    
    render(
      <EditTaskModal
        task={taskWithoutDate}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const dateInput = screen.getByDisplayValue('');
    expect(dateInput).toBeInTheDocument();
  });

  it('can clear due date', async () => {
    mockOnSave.mockResolvedValue({});
    
    render(
      <EditTaskModal
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const dateInput = screen.getByDisplayValue('2025-12-20');
    const saveButton = screen.getByText(/Save Changes/);

    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Original Task',
        due_date: null
      });
    });
  });
});
