#!/bin/bash

echo "🚀 School Fee Receipt Generator - Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is clean and ready for deployment"
echo ""

echo "📋 Deployment Checklist:"
echo "1. Backend (Railway):"
echo "   - Go to https://railway.app"
echo "   - Sign up with GitHub"
echo "   - Create new project from GitHub repo"
echo "   - Select 'server' folder as source"
echo "   - Add environment variables:"
echo "     NODE_ENV=production"
echo "     MONGO_URI=your-mongodb-atlas-uri"
echo "     PORT=5000"
echo ""

echo "2. Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Import your GitHub repository"
echo "   - Configure build settings:"
echo "     Framework: Create React App"
echo "     Root Directory: client"
echo "     Build Command: npm run build"
echo "     Output Directory: build"
echo "   - Add environment variable:"
echo "     REACT_APP_API_URL=https://your-railway-url.railway.app/api"
echo ""

echo "3. Database (MongoDB Atlas):"
echo "   - Go to https://mongodb.com/atlas"
echo "   - Create free account"
echo "   - Create new cluster (free tier)"
echo "   - Set up database access"
echo "   - Set up network access (0.0.0.0/0)"
echo "   - Copy connection string to Railway"
echo ""

echo "4. Update Configuration:"
echo "   - Update client/env.production with your Railway URL"
echo "   - Update server/server.js CORS origins with your Vercel URL"
echo ""

echo "🔗 Useful Links:"
echo "- Railway: https://railway.app"
echo "- Vercel: https://vercel.com"
echo "- MongoDB Atlas: https://mongodb.com/atlas"
echo "- This Guide: DEPLOYMENT_GUIDE.md"
echo ""

echo "💰 Cost: $0-5/month (mostly free!)"
echo ""

echo "🎉 After deployment, your app will be available at:"
echo "- Frontend: https://your-app.vercel.app"
echo "- Backend: https://your-app.railway.app"
echo ""

echo "Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions." 