# Goal Tracker Frontend

A modern React application for tracking and managing personal and professional goals.

## Features

- **User Authentication**: Secure registration and login
- **Goal Management**: Create, edit, and track goals with detailed information
- **Milestones**: Break down goals into smaller, manageable tasks
- **Progress Tracking**: Visual progress indicators and completion rates
- **Categories & Tags**: Organize goals by categories and custom tags
- **Analytics Dashboard**: Insights into your goal completion patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling and design system
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client
- **Date-fns** - Date manipulation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment variables (optional):
   ```bash
   # .env.local
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── goals/           # Goal-specific components
│   └── layout/          # Layout components
├── contexts/            # React contexts for state management
├── pages/               # Page components
├── services/            # API services
├── App.js               # Main app component
├── index.js             # Entry point
└── index.css            # Global styles
```

## Key Features

### Dashboard
- Overview of all goals
- Quick stats and completion rates
- Recent goals and quick actions

### Goal Management
- Create goals with categories, priorities, and target dates
- Add milestones to break down complex goals
- Track progress with visual indicators
- Add notes for detailed tracking

### Analytics
- Completion rate visualization
- Goals by category breakdown
- Monthly progress trends
- Achievement badges

### Profile Management
- Update personal information
- Change password securely
- Customize preferences and notifications

## API Integration

The frontend communicates with the backend API through:
- Axios HTTP client with automatic token handling
- Request/response interceptors for authentication
- Error handling and user feedback
- Context-based state management

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom components** for consistent design
- **Responsive design** for all screen sizes
- **Dark/light theme** support (coming soon)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
