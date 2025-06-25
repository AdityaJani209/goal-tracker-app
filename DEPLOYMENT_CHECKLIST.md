# 🚀 Deployment Checklist

## Pre-Deployment Preparation

### ✅ Code Preparation
- [ ] All code committed and pushed to GitHub
- [ ] No sensitive data in code (passwords, API keys)
- [ ] Environment variables properly configured
- [ ] Production build tested locally
- [ ] All dependencies listed in package.json
- [ ] Remove console.logs and debug code

### ✅ Backend Checklist
- [ ] Environment variables configured (.env.example updated)
- [ ] CORS settings updated for production domain
- [ ] Database connection string ready
- [ ] JWT secret generated (32+ characters)
- [ ] Error handling implemented
- [ ] Health check endpoint working
- [ ] API rate limiting configured

### ✅ Frontend Checklist
- [ ] API URL environment variable set
- [ ] Production build working (`npm run build`)
- [ ] Routing configured (SPA redirects)
- [ ] Error boundaries implemented
- [ ] Performance optimized (images, bundle size)
- [ ] Meta tags and SEO configured

### ✅ Database Checklist
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with proper permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string tested
- [ ] Backup strategy planned

---

## Deployment Steps

### 🗄️ Step 1: Database (MongoDB Atlas)
1. **Create Account**: [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: M0 Sandbox (Free)
3. **Create User**: Database access with read/write permissions
4. **Network Access**: Allow all IPs (0.0.0.0/0) or specific IPs
5. **Get Connection String**: mongodb+srv://...

### 🚂 Step 2: Backend (Railway)
1. **Create Account**: [Railway](https://railway.app)
2. **Connect GitHub**: Link your repository
3. **Deploy**: New Project → Deploy from GitHub
4. **Configure**: Root directory = `server`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_32_character_secret
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
6. **Deploy**: Railway auto-deploys on push

### ⚡ Step 3: Frontend (Vercel)
1. **Create Account**: [Vercel](https://vercel.com)
2. **Import Project**: Connect GitHub repository
3. **Configure**: 
   - Framework: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app/api
   ```
5. **Deploy**: Vercel auto-deploys on push

### 🔄 Step 4: Update CORS
1. **Go to Railway Dashboard**
2. **Update CLIENT_URL**: Use your actual Vercel URL
3. **Redeploy**: Railway will update automatically

---

## Post-Deployment Testing

### ✅ Backend Testing
```bash
# Test health endpoint
curl https://your-railway-app.railway.app/api/health

# Test CORS
curl -H "Origin: https://your-vercel-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://your-railway-app.railway.app/api/health
```

### ✅ Frontend Testing
- [ ] Website loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Goal creation works
- [ ] API calls successful
- [ ] Dark/light theme toggles
- [ ] Mobile responsiveness

### ✅ Database Testing
- [ ] Data persists between sessions
- [ ] User registration creates database entry
- [ ] Goals are saved and retrieved
- [ ] Database queries perform well

---

## Environment Variables Summary

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-railway-app.railway.app/api
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goaltracker
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d
CLIENT_URL=https://your-vercel-app.vercel.app
```

---

## Quick Commands

### Generate JWT Secret
```bash
# Generate secure 32-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Local Production Build
```bash
# Frontend
cd client
npm run build
npx serve -s build -l 3000

# Backend  
cd server
NODE_ENV=production npm start
```

### Deploy Updates
```bash
# Push changes to deploy
git add .
git commit -m "Update for production"
git push origin main
# Both Railway and Vercel auto-deploy on push
```

---

## 🔍 Troubleshooting

### Common Issues
1. **CORS Error**: Update CLIENT_URL in Railway
2. **API Not Found**: Check REACT_APP_API_URL
3. **Database Connection**: Verify MongoDB URI and IP whitelist
4. **Build Failure**: Check Node.js version compatibility
5. **Authentication Issues**: Verify JWT_SECRET consistency

### Debug URLs
- Railway Logs: `https://railway.app/project/[project-id]`
- Vercel Logs: `https://vercel.com/[username]/[project]/deployments`
- MongoDB Atlas: `https://cloud.mongodb.com/`

---

## 🎉 Success!

Your Goal Tracker app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

Share your app and start tracking goals! 🎯
