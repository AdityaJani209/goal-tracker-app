# Testing Guide for Goal Tracker App

## Overview

This guide covers manual testing procedures and automated testing setup for the Goal Tracker application.

## Manual Testing Checklist

### Backend API Testing

#### Authentication Endpoints

**POST /api/auth/register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**POST /api/auth/login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**GET /api/auth/profile**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Goals Endpoints

**POST /api/goals**
```bash
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Learn React",
    "description": "Master React development",
    "category": "learning",
    "priority": "high",
    "targetDate": "2024-12-31"
  }'
```

**GET /api/goals**
```bash
curl -X GET http://localhost:5000/api/goals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**GET /api/goals/:id**
```bash
curl -X GET http://localhost:5000/api/goals/GOAL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**PUT /api/goals/:id**
```bash
curl -X PUT http://localhost:5000/api/goals/GOAL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Goal Title",
    "status": "in-progress"
  }'
```

**DELETE /api/goals/:id**
```bash
curl -X DELETE http://localhost:5000/api/goals/GOAL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Milestones

**POST /api/goals/:id/milestones**
```bash
curl -X POST http://localhost:5000/api/goals/GOAL_ID/milestones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete React Tutorial",
    "description": "Finish the official React tutorial",
    "targetDate": "2024-06-30"
  }'
```

**PUT /api/goals/:goalId/milestones/:milestoneId**
```bash
curl -X PUT http://localhost:5000/api/goals/GOAL_ID/milestones/MILESTONE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "completed": true
  }'
```

#### Notes

**POST /api/goals/:id/notes**
```bash
curl -X POST http://localhost:5000/api/goals/GOAL_ID/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Made good progress today. Learned about hooks."
  }'
```

#### Statistics

**GET /api/goals/stats**
```bash
curl -X GET http://localhost:5000/api/goals/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing

#### User Authentication Flow

1. **Registration**
   - Navigate to `/register`
   - Fill in name, email, password, confirm password
   - Check password validation
   - Verify successful registration and redirect to dashboard

2. **Login**
   - Navigate to `/login`
   - Enter valid credentials
   - Verify successful login and redirect to dashboard
   - Test "Remember me" functionality

3. **Logout**
   - Click logout button
   - Verify redirect to login page
   - Ensure user cannot access protected routes

4. **Protected Routes**
   - Try accessing `/dashboard`, `/goals`, `/analytics`, `/profile` without authentication
   - Verify redirect to login page

#### Goal Management

1. **Create Goal**
   - Click "New Goal" button
   - Fill in all required fields
   - Test form validation
   - Verify goal appears in goals list

2. **View Goals**
   - Check goals list displays correctly
   - Test filtering by status, category, priority
   - Test search functionality
   - Verify pagination if implemented

3. **Goal Details**
   - Click on a goal to view details
   - Verify all goal information displays correctly
   - Test edit functionality
   - Test delete functionality

4. **Milestones**
   - Add milestones to a goal
   - Mark milestones as completed
   - Verify progress updates

5. **Notes**
   - Add notes to a goal
   - Verify notes display correctly
   - Test note timestamps

#### Dashboard

1. **Statistics Display**
   - Verify goal counts by status
   - Check completion percentages
   - Test charts and graphs

2. **Recent Activity**
   - Check recent goals display
   - Verify quick action buttons work

#### Analytics

1. **Charts and Graphs**
   - Verify data visualization loads
   - Test different time periods
   - Check data accuracy

#### Profile Management

1. **Profile Information**
   - Update name and email
   - Verify changes save correctly

2. **Password Change**
   - Test current password validation
   - Change password
   - Verify new password works

3. **Preferences**
   - Change theme settings
   - Update notification preferences
   - Verify settings persist

#### Responsive Design

1. **Mobile View (< 768px)**
   - Test navigation menu
   - Verify forms are usable
   - Check button sizes

2. **Tablet View (768px - 1024px)**
   - Test sidebar behavior
   - Verify layouts adapt correctly

3. **Desktop View (> 1024px)**
   - Test full layout
   - Verify all components display properly

#### Accessibility Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Test Enter key functionality
   - Verify focus indicators

2. **Screen Reader Testing**
   - Test with NVDA/JAWS/VoiceOver
   - Verify alt text on images
   - Check form labels

3. **Color Contrast**
   - Verify text is readable
   - Test with high contrast mode

## Automated Testing Setup

### Backend Testing with Jest

**Install testing dependencies:**
```bash
cd server
npm install --save-dev jest supertest mongodb-memory-server
```

**Create test configuration (`server/jest.config.js`):**
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!server.js'
  ]
};
```

**Example test file (`server/tests/auth.test.js`):**
```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    test('should not register user with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

**Run backend tests:**
```bash
cd server
npm test
```

### Frontend Testing with React Testing Library

**Install testing dependencies:**
```bash
cd client
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

**Example test file (`client/src/components/__tests__/GoalCard.test.js`):**
```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GoalCard from '../goals/GoalCard';

const mockGoal = {
  _id: '1',
  title: 'Test Goal',
  description: 'Test Description',
  status: 'active',
  priority: 'high',
  category: 'personal',
  createdAt: new Date().toISOString()
};

const renderGoalCard = (goal = mockGoal) => {
  return render(
    <BrowserRouter>
      <GoalCard goal={goal} />
    </BrowserRouter>
  );
};

describe('GoalCard', () => {
  test('renders goal title', () => {
    renderGoalCard();
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
  });

  test('displays priority badge', () => {
    renderGoalCard();
    expect(screen.getByText('High')).toBeInTheDocument();
  });
});
```

**Run frontend tests:**
```bash
cd client
npm test
```

### End-to-End Testing with Cypress

**Install Cypress:**
```bash
cd client
npm install --save-dev cypress
```

**Example E2E test (`client/cypress/e2e/auth.cy.js`):**
```javascript
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a new user', () => {
    cy.get('[data-cy=name-input]').type('Test User');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=confirm-password-input]').type('password123');
    cy.get('[data-cy=register-button]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome to your dashboard');
  });

  it('should login existing user', () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-button]').click();

    cy.url().should('include', '/dashboard');
  });
});
```

**Run Cypress tests:**
```bash
cd client
npx cypress open
```

## Performance Testing

### Load Testing with Artillery

**Install Artillery:**
```bash
npm install -g artillery
```

**Create test configuration (`load-test.yml`):**
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'API Load Test'
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.token'
              as: 'token'
      - get:
          url: '/api/goals'
          headers:
            Authorization: 'Bearer {{ token }}'
```

**Run load test:**
```bash
artillery run load-test.yml
```

## Test Data Management

### Test Database Setup

**Create test data script (`server/scripts/seedTestData.js`):**
```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
const Goal = require('../models/Goal');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Goal.deleteMany({});

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create test goals
    await Goal.create([
      {
        title: 'Learn React',
        description: 'Master React development',
        category: 'learning',
        priority: 'high',
        status: 'active',
        user: user._id
      },
      {
        title: 'Exercise Daily',
        description: 'Maintain daily exercise routine',
        category: 'health',
        priority: 'medium',
        status: 'completed',
        user: user._id
      }
    ]);

    console.log('Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
};

seedData();
```

**Run test data seeding:**
```bash
cd server
node scripts/seedTestData.js
```

## Continuous Integration

### GitHub Actions Example (`.github/workflows/test.yml`):

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: |
          cd server
          npm install
      
      - name: Run backend tests
        run: |
          cd server
          npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/goaltracker-test
          JWT_SECRET: test-secret

  frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install frontend dependencies
        run: |
          cd client
          npm install
      
      - name: Run frontend tests
        run: |
          cd client
          npm test -- --coverage --watchAll=false
      
      - name: Build frontend
        run: |
          cd client
          npm run build
```

## Debugging Tips

1. **Backend Debugging:**
   - Use `console.log` strategically
   - Check MongoDB connection
   - Verify environment variables
   - Use Postman for API testing

2. **Frontend Debugging:**
   - Use React Developer Tools
   - Check browser console
   - Use network tab for API calls
   - Test with different browsers

3. **Integration Issues:**
   - Verify CORS configuration
   - Check API base URLs
   - Test authentication flow
   - Monitor network requests

Remember to run tests regularly during development and before deploying to production!
