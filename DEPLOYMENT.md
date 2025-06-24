# Goal Tracker App - Deployment Guide

## Overview

This guide covers deployment options for the Goal Tracker full-stack application.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Environment variables configured

## Environment Setup

### Backend Environment Variables

Create `.env` file in the `server/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/goaltracker

# JWT Secret (use a strong, random secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### Frontend Environment Variables

Create `.env` file in the `client/` directory:

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api
```

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

1. **Install dependencies:**
   ```bash
   cd server
   npm install --production
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Use PM2 for process management (recommended):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "goal-tracker-api"
   pm2 startup
   pm2 save
   ```

#### Frontend Deployment

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   ```

2. **Serve with a static server:**
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

3. **Or configure with Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/client/build;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile (`server/Dockerfile`):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile (`client/Dockerfile`):**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose (`docker-compose.yml`):**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: goal-tracker-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    container_name: goal-tracker-api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/goaltracker
      - JWT_SECRET=your-super-secret-jwt-key-here
      - NODE_ENV=production
      - CLIENT_URL=http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./client
    container_name: goal-tracker-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

### Option 3: Cloud Deployment

#### Heroku Deployment

**Backend (Heroku):**

1. **Create Heroku app:**
   ```bash
   cd server
   heroku create your-app-name-api
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
   heroku config:set MONGODB_URI=your-mongodb-atlas-connection-string
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

**Frontend (Netlify/Vercel):**

1. **Build and deploy to Netlify:**
   ```bash
   cd client
   npm run build
   # Upload build folder to Netlify or connect GitHub repo
   ```

2. **Environment variables:**
   ```env
   REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
   ```

#### AWS Deployment

**Backend (AWS EC2/Elastic Beanstalk):**
- Use Elastic Beanstalk for easy Node.js deployment
- Configure RDS for MongoDB or use DocumentDB

**Frontend (AWS S3 + CloudFront):**
- Upload build files to S3 bucket
- Configure CloudFront for CDN and custom domain

## Database Options

### Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod --dbpath /path/to/data/directory
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in environment variables

### Docker MongoDB
```bash
docker run -d \
  --name goal-tracker-mongo \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

## Security Considerations

1. **Use strong JWT secrets** - Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. **Enable HTTPS** in production
3. **Set up proper CORS** origins
4. **Use environment variables** for all secrets
5. **Enable MongoDB authentication** in production
6. **Set up rate limiting** (already implemented)
7. **Keep dependencies updated**

## Monitoring and Maintenance

### Health Checks
- Backend: `GET /api/health`
- Frontend: Ensure React app loads properly

### Logging
- Use PM2 logs: `pm2 logs goal-tracker-api`
- Set up application monitoring (e.g., New Relic, DataDog)

### Backup
- Regular MongoDB backups
- Code repository backups

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's running on port
   netstat -tulpn | grep :5000
   # Kill process
   kill -9 PID
   ```

2. **MongoDB connection issues:**
   - Check MongoDB service status
   - Verify connection string
   - Check network/firewall settings

3. **Build errors:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Performance Optimization

1. **Enable gzip compression**
2. **Implement caching strategies**
3. **Optimize MongoDB queries**
4. **Use CDN for static assets**
5. **Implement lazy loading in React**

## Scaling Considerations

1. **Horizontal scaling** with load balancers
2. **Database sharding** for large datasets
3. **Caching layer** (Redis)
4. **Microservices architecture** for large teams
5. **Container orchestration** (Kubernetes)

## Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test API endpoints manually
4. Check database connectivity
5. Review network/firewall settings

---

Happy deploying! 🚀
