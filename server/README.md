# Goal Tracker Backend API

A comprehensive REST API for a goal tracking application built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Registration, login, profile management
- **Goal Management**: CRUD operations for goals with categories, priorities, and status tracking
- **Milestones**: Break down goals into smaller, manageable milestones
- **Progress Tracking**: Automatic progress calculation based on milestones
- **Notes**: Add notes to goals for better tracking
- **Statistics**: Get insights into goal completion rates and progress
- **Search & Filter**: Find goals by status, category, priority, or search terms
- **Security**: JWT authentication, input validation, rate limiting

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password

### Goals
- `GET /api/goals` - Get all goals (with filtering and pagination)
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/goals/stats/overview` - Get goal statistics

### Milestones
- `POST /api/goals/:id/milestones` - Add milestone to goal
- `PUT /api/goals/:id/milestones/:milestoneId` - Update milestone
- `DELETE /api/goals/:id/milestones/:milestoneId` - Delete milestone

### Notes
- `POST /api/goals/:id/notes` - Add note to goal

## Data Models

### User
- name, email, password
- preferences (theme, notifications)
- avatar

### Goal
- title, description, category, priority, status
- targetDate, progress, completedAt
- milestones, tags, notes
- user reference

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/goaltracker
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting
- Security headers with helmet
- CORS configuration

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
