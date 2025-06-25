# 🎯 Goal Tracker App

A full-stack web application for tracking and managing personal and professional goals. Built with React frontend and Node.js/Express backend.

![Goal Tracker](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX** with Tailwind CSS and dark/light theme support
- **Responsive Design** for all devices
- **Real-time Dashboard** with statistics and quick actions
- **Kanban Board** with drag-and-drop goal management
- **Advanced Goal Management** with milestones, notes, and tags
- **Analytics & Insights** with completion charts and achievements
- **User Authentication** with JWT and secure profile management
- **Profile Management** with preferences and theme settings

### 🔧 Backend Features
- **RESTful API** with Express.js
- **JWT Authentication** with secure routes and refresh tokens
- **MongoDB Database** with Mongoose ODM and fallback in-memory storage
- **Input Validation** and comprehensive error handling
- **Rate Limiting** and security headers
- **Comprehensive Goal CRUD** operations with status management
- **Statistics & Analytics** endpoints with aggregation
- **Milestone & Notes Management** with full CRUD operations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd goal-tracker-app
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
goal-tracker-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                 # Express Backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Entry point
│   └── package.json
├── IMPLEMENTATION_GUIDE.md # Detailed setup guide
└── README.md              # This file
```

## 🎯 Core Functionality

### Goal Management
- ✅ Create, edit, and delete goals with comprehensive validation
- ✅ Set categories, priorities, and target dates
- ✅ Track progress with visual indicators and milestones
- ✅ Add notes and comments for detailed tracking
- ✅ Tag system for flexible organization
- ✅ **Kanban Board** with drag-and-drop status management
- ✅ **Modal-based editing** for seamless user experience
- ✅ Advanced filtering and search capabilities

### Analytics & Insights
- 📊 **Real-time completion rate** tracking with visual charts
- 📈 **Progress trends** and monthly statistics
- 🏆 **Achievement system** with unlockable badges
- 📅 **Category breakdown** with color-coded visualization
- 📈 **Monthly goal completion** trends
- � **Overdue goal tracking** and notifications

### User Experience
- 👤 **Complete user authentication** system
- 🔐 **Secure profile management** with password changes
- ⚙️ **Customizable preferences** and settings
- 📧 **Notification preferences** management
- 🎨 **Full dark/light theme** support with persistence
- 📱 **Responsive design** for mobile and desktop
- ♿ **Accessibility features** and keyboard navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Tailwind CSS** - Utility-first styling with dark mode support
- **React Router** - Client-side navigation
- **React Hook Form** - Performant form management
- **@hello-pangea/dnd** - Drag and drop for Kanban board
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library
- **Date-fns** - Lightweight date utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Minimalist web framework
- **MongoDB** - NoSQL database with fallback storage
- **Mongoose** - Object Document Mapper
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and salting
- **Express Validator** - Input validation middleware
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting middleware

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register     # Register user
POST /api/auth/login        # Login user
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
PUT  /api/auth/change-password # Change password
```

### Goals
```
GET    /api/goals                    # Get all goals
GET    /api/goals/:id               # Get single goal
POST   /api/goals                   # Create goal
PUT    /api/goals/:id               # Update goal
DELETE /api/goals/:id               # Delete goal
GET    /api/goals/stats/overview    # Get statistics
```

### Milestones & Notes
```
POST   /api/goals/:id/milestones              # Add milestone
PUT    /api/goals/:id/milestones/:milestoneId # Update milestone
DELETE /api/goals/:id/milestones/:milestoneId # Delete milestone
POST   /api/goals/:id/notes                   # Add note
```

## 🎨 Screenshots

### Dashboard
- **Real-time statistics** with completion rates and goal counts
- **Recent goals** overview with quick actions
- **Visual progress indicators** and achievement tracking
- **Quick navigation** to goal creation and management

### Kanban Board
- **Drag-and-drop interface** for goal status management
- **Column-based organization** (Not Started, In Progress, Completed, etc.)
- **Visual goal cards** with priorities, categories, and progress
- **Inline editing** with modal dialogs

### Goal Management
- **Comprehensive goal creation** with all metadata
- **Advanced filtering** by status, category, and priority
- **Detailed goal view** with milestones and notes
- **Progress tracking** with visual indicators

### Analytics Dashboard
- **Completion rate charts** with visual progress rings
- **Category breakdown** with color-coded statistics
- **Monthly trends** and progress tracking
- **Achievement badges** and milestone celebrations

### Profile & Settings
- **User profile management** with avatar support
- **Theme preferences** with instant dark/light mode switching
- **Notification settings** and preferences
- **Security features** including password changes

## 🔒 Security Features

- **JWT Authentication** with secure token management and expiration
- **Password Hashing** with bcryptjs and salt rounds
- **Input Validation** and sanitization on all endpoints
- **Rate Limiting** to prevent brute force and DDoS attacks
- **Security Headers** with Helmet middleware
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive configuration
- **Error Handling** without sensitive information exposure
- **SQL Injection Prevention** through Mongoose ODM
- **XSS Protection** with proper input sanitization

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy build folder to Vercel
```

### Backend (Heroku)
```bash
cd server
# Set environment variables in Heroku
# Deploy with Git or GitHub integration
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework and ecosystem
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible NoSQL database solution
- **Express.js** for the minimalist web framework
- **Vercel** and **Heroku** for deployment platforms
- **Open Source Community** for the incredible libraries and tools

## 🆕 Recent Updates

- ✅ **Dark Theme Support** - Complete dark/light mode with theme persistence
- ✅ **Kanban Board** - Drag-and-drop goal management interface
- ✅ **Enhanced Analytics** - Improved charts and achievement system
- ✅ **Mobile Responsiveness** - Optimized for all device sizes
- ✅ **Accessibility Improvements** - Better keyboard navigation and screen reader support
- ✅ **Performance Optimizations** - Faster loading and smoother interactions

## 📞 Support

If you have any questions or issues:
- 📧 **Open an issue** on GitHub with detailed description
- 💬 **Contact the development team** for direct support
- 📖 **Check the documentation** in the `/docs` folder
- 🔍 **Search existing issues** before creating new ones

## 🔗 Additional Resources

- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Detailed setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment steps
- [Testing Guide](./TESTING.md) - Testing strategies and examples
- [API Documentation](./docs/API.md) - Complete API reference

---

**Happy Goal Tracking! 🎯**

*Built with ❤️ by the Goal Tracker Team*
