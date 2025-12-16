const request = require('supertest');
const { app, db, validateTask, sortTasksByDueDate } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createTask = async (title = 'Test Task', due_date = null) => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title, due_date })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('Unit Tests', () => {
  describe('validateTask', () => {
    it('should validate a task with title only', () => {
      const result = validateTask({ title: 'Valid Task' });
      expect(result.isValid).toBe(true);
    });

    it('should validate a task with title and due date', () => {
      const result = validateTask({ title: 'Valid Task', due_date: '2025-12-20' });
      expect(result.isValid).toBe(true);
    });

    it('should reject task with empty title', () => {
      const result = validateTask({ title: '' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('title is required');
    });

    it('should reject task with invalid due date format', () => {
      const result = validateTask({ title: 'Task', due_date: '12/20/2025' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('YYYY-MM-DD format');
    });

    it('should reject task with invalid date', () => {
      const result = validateTask({ title: 'Task', due_date: '2025-13-45' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid due date');
    });
  });

  describe('sortTasksByDueDate', () => {
    it('should sort tasks by due date in ascending order', () => {
      const tasks = [
        { id: 1, title: 'Task C', due_date: '2025-12-20' },
        { id: 2, title: 'Task A', due_date: '2025-12-18' },
        { id: 3, title: 'Task B', due_date: '2025-12-19' }
      ];
      
      const sorted = sortTasksByDueDate(tasks);
      
      expect(sorted[0].title).toBe('Task A');
      expect(sorted[1].title).toBe('Task B');
      expect(sorted[2].title).toBe('Task C');
    });

    it('should place tasks without due dates at the end', () => {
      const tasks = [
        { id: 1, title: 'Task with date', due_date: '2025-12-20' },
        { id: 2, title: 'Task without date', due_date: null },
        { id: 3, title: 'Earlier task', due_date: '2025-12-18' }
      ];
      
      const sorted = sortTasksByDueDate(tasks);
      
      expect(sorted[0].title).toBe('Earlier task');
      expect(sorted[1].title).toBe('Task with date');
      expect(sorted[2].title).toBe('Task without date');
    });
  });
});

describe('Integration Tests - API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks sorted by due date', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if tasks have the expected structure
      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('due_date');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('created_at');
      expect(task).toHaveProperty('updated_at');
    });

    it('should return tasks sorted by due date', async () => {
      const response = await request(app).get('/api/tasks');
      
      const tasksWithDates = response.body.filter(t => t.due_date);
      for (let i = 1; i < tasksWithDates.length; i++) {
        const prev = new Date(tasksWithDates[i - 1].due_date);
        const curr = new Date(tasksWithDates[i].due_date);
        expect(prev.getTime()).toBeLessThanOrEqual(curr.getTime());
      }
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with title only', async () => {
      const newTask = { title: 'Test Task Without Date' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.due_date).toBeNull();
      expect(response.body.completed).toBe(0);
    });

    it('should create a new task with title and due date', async () => {
      const newTask = { title: 'Test Task With Date', due_date: '2025-12-25' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.due_date).toBe(newTask.due_date);
    });

    it('should trim whitespace from task title', async () => {
      const newTask = { title: '  Task with spaces  ' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Task with spaces');
    });

    it('should return 400 for empty title', async () => {
      const newTask = { title: '' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid due date', async () => {
      const newTask = { title: 'Task', due_date: 'invalid-date' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('YYYY-MM-DD');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await createTask('Original Title', '2025-12-20');
      
      const updatedData = { title: 'Updated Title', due_date: '2025-12-25' };
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.due_date).toBe(updatedData.due_date);
      expect(response.body.id).toBe(task.id);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });

    it('should return 400 for invalid task data', async () => {
      const task = await createTask('Test Task');
      
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ title: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion status', async () => {
      const task = await createTask('Task to Complete');
      expect(task.completed).toBe(0);
      
      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);
      
      // Toggle back
      const response2 = await request(app)
        .patch(`/api/tasks/${task.id}/complete`);

      expect(response2.status).toBe(200);
      expect(response2.body.completed).toBe(0);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/99999/complete');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask('Task to Delete');
      
      const response = await request(app)
        .delete(`/api/tasks/${task.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');
      
      // Verify task is deleted
      const getResponse = await request(app).get('/api/tasks');
      const deletedTask = getResponse.body.find(t => t.id === task.id);
      expect(deletedTask).toBeUndefined();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/99999');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid');

      expect(response.status).toBe(400);
    });
  });
});