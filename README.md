# 🎯 Goal Tracker App

A full-stack web application for tracking and managing personal and professional goals. Built with React frontend and Node.js/Express backend.

![Goal Tracker](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX** with Tailwind CSS
- **Responsive Design** for all devices
- **Real-time Dashboard** with statistics
- **Advanced Goal Management** with milestones
- **Analytics & Insights** with charts
- **User Authentication** with JWT
- **Profile Management** with preferences

### 🔧 Backend Features
- **RESTful API** with Express.js
- **JWT Authentication** with secure routes
- **MongoDB Database** with Mongoose ODM
- **Input Validation** and error handling
- **Rate Limiting** and security headers
- **Comprehensive Goal CRUD** operations
- **Statistics & Analytics** endpoints

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
- ✅ Create, edit, and delete goals
- ✅ Set categories, priorities, and target dates
- ✅ Track progress with milestones
- ✅ Add notes and comments
- ✅ Tag system for organization

### Analytics & Insights
- 📊 Completion rate tracking
- 📈 Progress charts and trends
- 🏆 Achievement badges
- 📅 Monthly goal statistics
- 🎨 Category breakdown visualization

### User Features
- 👤 User registration and authentication
- 🔐 Secure profile management
- ⚙️ Customizable preferences
- 📧 Notification settings
- 🎨 Theme preferences (light/dark)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date utilities

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

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
- Real-time statistics and progress overview
- Recent goals with quick actions
- Completion rate visualization

### Goal Management
- Comprehensive goal creation form
- Advanced filtering and search
- Detailed goal view with milestones

### Analytics
- Progress charts and trends
- Category breakdown
- Achievement system

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password Hashing** with bcryptjs
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **Security Headers** with Helmet
- **CORS Configuration** for secure requests

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

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Express.js for the minimalist web framework

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy Goal Tracking! 🎯**
