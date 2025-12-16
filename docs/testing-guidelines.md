# Testing Guidelines

## Overview

This document outlines the testing principles and requirements for the TODO application. A comprehensive testing strategy ensures code quality, reliability, and maintainability.

## Testing Principles

### 1. Test Coverage Requirements

All code in this application must include appropriate test coverage across multiple levels:

- **Unit Tests**: Required for all business logic, utilities, and individual components
- **Integration Tests**: Required for API endpoints, component interactions, and data flows
- **End-to-End Tests**: Required for critical user workflows and complete feature flows

### 2. Test-Driven Development

- All new features must include appropriate tests before or alongside implementation
- Tests should be written to verify requirements and acceptance criteria
- Test cases should be considered during feature design and planning

### 3. Test Maintainability

Tests must be maintainable and sustainable over time:

- **Clear and Descriptive**: Test names should clearly describe what is being tested
- **Independent**: Tests should not depend on other tests or execution order
- **Repeatable**: Tests should produce consistent results across multiple runs
- **Focused**: Each test should verify a single behavior or outcome
- **Readable**: Test code should be as clean and understandable as production code

## Testing Levels

### Unit Tests

**Purpose**: Verify individual units of code in isolation

**Requirements**:
- Test individual functions, methods, and components
- Mock external dependencies (APIs, databases, external services)
- Fast execution (milliseconds per test)
- High coverage of edge cases and error conditions

**What to Test**:
- Business logic and calculations
- Data transformations and validations
- Component rendering and state management
- Utility functions and helpers
- Error handling and edge cases

**Example Scenarios**:
- Task creation with valid and invalid data
- Date validation and formatting
- Task sorting logic
- Component prop handling

### Integration Tests

**Purpose**: Verify that multiple units work together correctly

**Requirements**:
- Test interactions between components, modules, or services
- Use real implementations where practical, mock only external systems
- Verify data flows and communication between layers
- Test API endpoints with actual request/response cycles

**What to Test**:
- API endpoints (request → controller → service → response)
- Database operations and queries
- Component integration and data passing
- State management across multiple components
- Authentication and authorization flows

**Example Scenarios**:
- Creating a task through the API and verifying database persistence
- Editing a task and ensuring UI updates correctly
- Sorting tasks and verifying correct order in the UI
- Error handling across frontend and backend

### End-to-End Tests

**Purpose**: Verify complete user workflows from start to finish

**Requirements**:
- Test from the user's perspective using a real or simulated browser
- Cover critical user journeys and happy paths
- Include negative test cases and error scenarios
- Test across different browsers and devices (where applicable)

**What to Test**:
- Complete user workflows (add task → edit task → mark complete)
- Critical business processes
- User authentication flows
- Form submissions and validations
- Navigation and routing

**Example Scenarios**:
- User adds a new task with a due date, edits it, and marks it complete
- User attempts to create a task with invalid data and sees appropriate errors
- User views sorted task list and verifies order
- User deletes a task and confirms removal

## Testing Tools and Frameworks

### Frontend Testing
- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Cypress or Playwright (recommended)

### Backend Testing
- **Unit/Integration**: Jest + Supertest (for API testing)
- **E2E**: Integration with frontend E2E tests

## Test Organization

### File Structure
- Place unit tests alongside source files: `component.js` → `component.test.js`
- Alternatively, use `__tests__` directories for grouping tests
- E2E tests should be in a dedicated directory (e.g., `e2e/` or `cypress/`)

### Naming Conventions
- Test files: `*.test.js` or `*.spec.js`
- Test suites: `describe('ComponentName', ...)`
- Test cases: `it('should [expected behavior]', ...)` or `test('[description]', ...)`

## Writing Maintainable Tests

### Best Practices

1. **Arrange-Act-Assert Pattern**
   ```javascript
   test('should add a new task', () => {
     // Arrange: Set up test data and conditions
     const task = { title: 'Test Task', dueDate: '2025-12-20' };
     
     // Act: Perform the action being tested
     const result = addTask(task);
     
     // Assert: Verify the expected outcome
     expect(result).toHaveProperty('id');
     expect(result.title).toBe('Test Task');
   });
   ```

2. **Avoid Test Interdependence**
   - Each test should set up its own data
   - Clean up after tests (reset mocks, clear databases)
   - Tests should pass regardless of execution order

3. **Use Descriptive Names**
   ```javascript
   // Good
   test('should sort tasks by due date in ascending order', () => { ... });
   
   // Bad
   test('sorting', () => { ... });
   ```

4. **Keep Tests Simple and Focused**
   - One assertion concept per test
   - Avoid complex logic in tests
   - Test one behavior at a time

5. **Use Test Helpers and Utilities**
   - Create reusable test data factories
   - Extract common setup into helper functions
   - Use shared fixtures for consistent test data

6. **Mock Appropriately**
   - Mock external dependencies (APIs, databases)
   - Use real implementations for internal code when possible
   - Keep mocks simple and focused

## Coverage Goals

### Minimum Coverage Targets
- **Unit Tests**: 80% code coverage
- **Integration Tests**: Cover all API endpoints and critical integrations
- **E2E Tests**: Cover all critical user workflows

### What Not to Over-Test
- Third-party libraries (assume they work)
- Simple getters/setters without logic
- Configuration files
- Generated code

## Continuous Integration

### CI/CD Requirements
- All tests must pass before code can be merged
- Run unit and integration tests on every commit
- Run E2E tests on pull requests
- Generate and publish coverage reports
- Fail builds if coverage drops below threshold

## Test Maintenance

### Regular Maintenance
- Update tests when requirements change
- Remove or update obsolete tests
- Refactor tests alongside production code
- Review and improve slow-running tests
- Keep dependencies up to date

### Code Review
- Review tests as thoroughly as production code
- Ensure tests verify the right behaviors
- Check for proper mocking and test isolation
- Verify test maintainability and clarity

## Example Test Patterns

### Unit Test Example
```javascript
describe('Task Sorting', () => {
  test('should sort tasks by due date in ascending order', () => {
    const tasks = [
      { id: 1, title: 'Task C', dueDate: '2025-12-20' },
      { id: 2, title: 'Task A', dueDate: '2025-12-18' },
      { id: 3, title: 'Task B', dueDate: '2025-12-19' }
    ];
    
    const sorted = sortTasksByDueDate(tasks);
    
    expect(sorted[0].title).toBe('Task A');
    expect(sorted[1].title).toBe('Task B');
    expect(sorted[2].title).toBe('Task C');
  });
});
```

### Integration Test Example
```javascript
describe('POST /api/tasks', () => {
  test('should create a new task with due date', async () => {
    const taskData = {
      title: 'Integration Test Task',
      dueDate: '2025-12-20'
    };
    
    const response = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(taskData.title);
    expect(response.body.dueDate).toBe(taskData.dueDate);
  });
});
```

### E2E Test Example
```javascript
describe('Task Management Flow', () => {
  it('should create, edit, and complete a task', () => {
    // Add a task
    cy.visit('/');
    cy.get('[data-testid="task-input"]').type('Buy groceries');
    cy.get('[data-testid="due-date-input"]').type('2025-12-20');
    cy.get('[data-testid="add-task-button"]').click();
    
    // Verify task appears
    cy.contains('Buy groceries').should('be.visible');
    
    // Edit the task
    cy.get('[data-testid="edit-task-button"]').first().click();
    cy.get('[data-testid="task-input"]').clear().type('Buy groceries and milk');
    cy.get('[data-testid="save-task-button"]').click();
    
    // Verify edit
    cy.contains('Buy groceries and milk').should('be.visible');
    
    // Complete the task
    cy.get('[data-testid="complete-task-button"]').first().click();
    cy.get('[data-testid="completed-tasks"]').should('contain', 'Buy groceries and milk');
  });
});
```

## Summary

All code contributions must include appropriate tests at the unit, integration, and end-to-end levels. Tests should be maintainable, clear, and comprehensive. By following these guidelines, we ensure a reliable, high-quality application that can evolve safely over time.
