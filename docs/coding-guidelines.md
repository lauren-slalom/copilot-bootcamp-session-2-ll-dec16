# Coding Guidelines

## Overview

This document outlines the coding style and quality principles for the TODO application. Consistent code style and adherence to best practices ensure maintainability, readability, and collaboration across the team.

## Code Quality Principles

### 1. DRY (Don't Repeat Yourself)

Avoid code duplication by extracting common logic into reusable functions, components, or modules.

**Good Practice:**
```javascript
// Extract common validation logic
function validateTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new Error('Task title is required');
  }
  if (task.dueDate && !isValidDate(task.dueDate)) {
    throw new Error('Invalid due date format');
  }
}
```

**Bad Practice:**
```javascript
// Duplicated validation in multiple places
function createTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new Error('Task title is required');
  }
  // ... create logic
}

function updateTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new Error('Task title is required');
  }
  // ... update logic
}
```

### 2. KISS (Keep It Simple, Stupid)

Write simple, straightforward code that is easy to understand and maintain. Avoid over-engineering solutions.

- Prefer clarity over cleverness
- Break complex functions into smaller, focused functions
- Use descriptive names that explain intent
- Avoid unnecessary abstractions

### 3. SOLID Principles

While primarily object-oriented, these principles apply to modern JavaScript:

- **Single Responsibility**: Each function/component should have one clear purpose
- **Open/Closed**: Code should be open for extension but closed for modification
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

### 4. Code Readability

Code is read far more often than it is written. Optimize for readability:

- Use meaningful variable and function names
- Add comments for complex logic, not obvious code
- Keep functions short and focused (ideally under 20 lines)
- Use consistent formatting and structure

## Formatting Rules

### General Formatting

- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 100 characters per line
- **Semicolons**: Use semicolons consistently
- **Quotes**: Use single quotes for strings, unless interpolating
- **Trailing Commas**: Use trailing commas in multi-line arrays and objects

**Example:**
```javascript
const task = {
  id: 1,
  title: 'Buy groceries',
  dueDate: '2025-12-20',
  completed: false,
};
```

### Naming Conventions

- **Variables and Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE` for true constants
- **Components**: `PascalCase` (React components)
- **Files**: Match the component/module name (`TaskList.js`, `taskService.js`)
- **Private Functions**: Prefix with underscore `_helperFunction` (optional)

**Examples:**
```javascript
// Variables and functions
const taskList = [];
function addTask(task) { /* ... */ }

// Constants
const MAX_TASKS = 100;
const API_BASE_URL = 'http://localhost:3001';

// Components
function TaskCard({ task }) { /* ... */ }
```

### Whitespace and Spacing

- Add blank lines between logical sections of code
- Use spaces around operators: `a + b`, not `a+b`
- No spaces inside parentheses: `if (condition)`, not `if ( condition )`
- One space after keywords: `if (`, `for (`, `while (`

### Code Organization

- Group related functionality together
- Order code logically (imports → constants → functions → exports)
- Keep related files close in the directory structure

## Import Organization

Organize imports in a consistent order to improve readability:

1. **External libraries** (third-party packages)
2. **Internal modules** (your own code)
3. **Relative imports** (files in the same directory or subdirectories)
4. **Styles/assets** (CSS, images, etc.)

**Example:**
```javascript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Internal modules
import { taskService } from '../services/taskService';
import { validateTask } from '../utils/validation';

// 3. Relative imports
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

// 4. Styles
import './TaskList.css';
```

### Import Best Practices

- Use named imports when possible for better tree-shaking
- Avoid wildcard imports (`import * as`) unless necessary
- Group imports from the same package
- Remove unused imports (linter will help catch these)

## Linter Usage

### ESLint Configuration

The project uses ESLint to enforce code quality and consistency. ESLint is configured to:

- Catch common errors and bugs
- Enforce consistent code style
- Identify anti-patterns and code smells
- Ensure best practices

### Running the Linter

```bash
# Run linter on all files
npm run lint

# Auto-fix issues where possible
npm run lint:fix
```

### Linter Rules

Key rules enforced by the linter:

- **No unused variables**: Variables must be used
- **No console logs**: Avoid `console.log` in production code (use proper logging)
- **Consistent quotes**: Enforce single quotes
- **Semicolons**: Require semicolons
- **No var**: Use `const` and `let`, never `var`
- **Prefer const**: Use `const` by default, `let` only when reassignment is needed

### Pre-commit Hooks

- Linter runs automatically before commits
- Code must pass linting to be committed
- Auto-fix is attempted where possible

## Best Practices

### 1. Use Modern JavaScript Features

Leverage ES6+ features for cleaner, more expressive code:

**Destructuring:**
```javascript
// Good
const { title, dueDate } = task;

// Avoid
const title = task.title;
const dueDate = task.dueDate;
```

**Arrow Functions:**
```javascript
// Good for short functions
const sortByDate = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);

// Use regular functions for complex logic or when you need 'this'
function TaskComponent() {
  // ...
}
```

**Template Literals:**
```javascript
// Good
const message = `Task "${task.title}" is due on ${task.dueDate}`;

// Avoid
const message = 'Task "' + task.title + '" is due on ' + task.dueDate;
```

**Spread Operator:**
```javascript
// Good
const updatedTask = { ...task, completed: true };

// Avoid
const updatedTask = Object.assign({}, task, { completed: true });
```

### 2. Error Handling

Always handle errors gracefully:

```javascript
// Good
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error; // Re-throw or handle appropriately
  }
}
```

### 3. Async/Await Over Promises

Prefer `async/await` for better readability:

```javascript
// Good
async function loadTasks() {
  const tasks = await fetchTasks();
  const sorted = await sortTasks(tasks);
  return sorted;
}

// Avoid (unless chaining makes more sense)
function loadTasks() {
  return fetchTasks()
    .then(tasks => sortTasks(tasks))
    .then(sorted => sorted);
}
```

### 4. Function Purity

Write pure functions when possible:

- Same input always produces same output
- No side effects
- Easier to test and reason about

```javascript
// Good - Pure function
function calculateDaysUntilDue(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

// Avoid - Impure (depends on external state)
let currentDate = new Date();
function calculateDaysUntilDue(dueDate) {
  const due = new Date(dueDate);
  return Math.ceil((due - currentDate) / (1000 * 60 * 60 * 24));
}
```

### 5. Immutability

Avoid mutating data structures:

```javascript
// Good
const completedTasks = tasks.map(task => 
  task.id === taskId ? { ...task, completed: true } : task
);

// Avoid
tasks.find(task => task.id === taskId).completed = true;
```

### 6. Component Design (React)

- Keep components small and focused
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use prop-types or TypeScript for type checking
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback` when passing to child components

```javascript
// Good - Small, focused component
function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</p>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}
```

### 7. Comments and Documentation

- Write self-documenting code with clear names
- Add comments for complex logic or non-obvious decisions
- Use JSDoc for public APIs and complex functions
- Avoid obvious comments that just restate the code

```javascript
/**
 * Sorts tasks by due date in ascending order.
 * Tasks without due dates are placed at the end.
 * 
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Sorted array of tasks
 */
function sortTasksByDueDate(tasks) {
  return tasks.sort((a, b) => {
    // Tasks without due dates go to the end
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
}
```

## Code Review Guidelines

When reviewing code, check for:

- **Functionality**: Does the code work as intended?
- **Tests**: Are there appropriate tests?
- **Style**: Does it follow these coding guidelines?
- **Clarity**: Is the code easy to understand?
- **Performance**: Are there obvious performance issues?
- **Security**: Are there potential security vulnerabilities?

## Summary

Following these coding guidelines ensures:

- Consistent code style across the project
- Improved code quality and maintainability
- Easier collaboration among team members
- Fewer bugs and issues
- Better developer experience

All code contributions should adhere to these guidelines. The linter will catch many issues automatically, but developers are expected to understand and apply these principles thoughtfully.
