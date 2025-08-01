# 🚀 Free Hosting Deployment Guide

## 🎯 **Recommended Setup: Vercel (Frontend) + Railway (Backend)**

### **Step 1: Deploy Backend to Railway**

#### 1.1 Prepare Your Repository
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 1.2 Deploy to Railway
1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Select the `server` folder as the source**

#### 1.3 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://your-mongodb-atlas-uri
PORT=5000
```

#### 1.4 Get Your Backend URL
- Railway will give you a URL like: `https://your-app-name.railway.app`
- Copy this URL for the next step

### **Step 2: Deploy Frontend to Vercel**

#### 2.1 Update API URL
Replace `your-railway-app-name.railway.app` in `client/env.production` with your actual Railway URL:
```
REACT_APP_API_URL=https://your-actual-railway-url.railway.app/api
```

#### 2.2 Deploy to Vercel
1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure build settings:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. **Add Environment Variable:**
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.railway.app/api`

#### 2.3 Deploy
Click "Deploy" and wait for the build to complete.

## 🔧 **Alternative Free Hosting Options**

### **Frontend Alternatives:**

#### **Netlify**
1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Set build command: `cd client && npm run build`
6. Set publish directory: `client/build`
7. Add environment variable: `REACT_APP_API_URL`

#### **GitHub Pages**
1. Build your React app: `cd client && npm run build`
2. Push the `build` folder to a GitHub repository
3. Go to repository Settings > Pages
4. Select source branch and folder

### **Backend Alternatives:**

#### **Render**
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your repository
5. Set build command: `cd server && npm install`
6. Set start command: `cd server && npm start`
7. Add environment variables

#### **Heroku (Paid but Good)**
1. Go to [Heroku.com](https://heroku.com)
2. Create account and install Heroku CLI
3. Run: `heroku create your-app-name`
4. Set environment variables
5. Deploy: `git push heroku main`

## 🗄️ **Database Setup**

### **MongoDB Atlas (Free Tier)**
1. **Go to [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Create free account**
3. **Create new cluster (free tier)**
4. **Set up database access (username/password)**
5. **Set up network access (allow all IPs: 0.0.0.0/0)**
6. **Get connection string**
7. **Add to Railway environment variables**

### **Railway MongoDB (Easier)**
1. In Railway dashboard, click "New"
2. Select "Database" > "MongoDB"
3. Railway will automatically connect it to your app

## 🔍 **Testing Your Deployment**

### **Backend Health Check**
```bash
curl https://your-railway-url.railway.app/health
```

### **Frontend Test**
1. Visit your Vercel URL
2. Try creating a receipt
3. Test PDF download
4. Verify all CRUD operations

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **CORS Errors**
- Update CORS origins in `server/server.js`
- Add your frontend URL to the allowed origins

#### **Environment Variables**
- Make sure all variables are set in Railway
- Check that frontend has correct API URL

#### **Puppeteer Issues**
- Railway supports Puppeteer out of the box
- If issues occur, add buildpack: `heroku buildpacks:add --index=1 heroku/nodejs`

#### **MongoDB Connection**
- Ensure MongoDB Atlas IP whitelist includes Railway IPs
- Check connection string format

## 💰 **Cost Breakdown**

### **Free Tier Limits:**
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Railway**: $5 credit/month (sufficient for small apps)
- **MongoDB Atlas**: 512MB storage, shared clusters
- **Netlify**: 100GB bandwidth, 300 build minutes

### **Total Monthly Cost: $0-5**

## 🚀 **Production Checklist**

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and connected to backend
- [ ] Database connected and working
- [ ] PDF generation working
- [ ] All CRUD operations functional
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Health check endpoint responding

## 📞 **Support**

- **Railway**: [Discord](https://discord.gg/railway)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **MongoDB Atlas**: [Support](https://docs.atlas.mongodb.com)

---

**Your School Fee Receipt Generator is now ready for production! 🎉** 