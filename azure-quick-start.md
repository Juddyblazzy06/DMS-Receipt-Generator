# 🚀 Azure Quick Start Guide

## 🎯 **Essential Steps for Azure Deployment**

### **1. Prerequisites**
- Azure Account (free tier available)
- Azure CLI installed
- GitHub repository with your code

### **2. Quick Deployment Commands**

```bash
# Login to Azure
az login

# Create everything in one go
az group create --name receipt-generator-rg --location "East US"

# Create backend
az appservice plan create --name receipt-generator-plan --resource-group receipt-generator-rg --sku B1 --is-linux
az webapp create --name your-backend-app --resource-group receipt-generator-rg --plan receipt-generator-plan --runtime "NODE|16-lts"

# Create frontend
az staticwebapp create --name your-frontend-app --resource-group receipt-generator-rg --source https://github.com/your-username/your-repo --location "East US" --branch main --app-location "/client" --api-location "" --output-location "build"

# Create database
az cosmosdb create --name your-cosmos-db --resource-group receipt-generator-rg --kind MongoDB --capabilities EnableMongo

# Get connection string
az cosmosdb keys list --name your-cosmos-db --resource-group receipt-generator-rg --type connection-strings

# Set environment variables
az webapp config appsettings set --name your-backend-app --resource-group receipt-generator-rg --settings NODE_ENV=production MONGO_URI="your-connection-string" PORT=5000
```

### **3. Manual Configuration Required**

#### **Update Frontend API URL**
In `client/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-app.azurewebsites.net/api';
```

#### **Set Frontend Environment Variable**
In Azure Portal → Static Web App → Configuration:
- **Name**: `REACT_APP_API_URL`
- **Value**: `https://your-backend-app.azurewebsites.net/api`

### **4. Deploy Your Code**

#### **Option A: GitHub Actions (Recommended)**
1. Push code to GitHub
2. Connect Azure Static Web App to your GitHub repo
3. Configure build settings in Azure Portal

#### **Option B: Manual Deployment**
```bash
# Backend
cd server
az webapp deployment source config-local-git --name your-backend-app --resource-group receipt-generator-rg
git init
git add .
git commit -m "Initial deployment"
git remote add azure <deployment-url>
git push azure main

# Frontend
cd client
npm run build
# Upload build folder to Azure Static Web App
```

### **5. Your App URLs**
- **Frontend**: `https://your-frontend-app.azurestaticapps.net`
- **Backend**: `https://your-backend-app.azurewebsites.net`

### **6. Cost Breakdown**
- **Free Tier (12 months)**: $0
- **Paid Tier**: ~$46/month
  - App Service: $13/month
  - Static Web Apps: $9/month
  - Cosmos DB: $24/month

### **7. Troubleshooting**

#### **Common Issues:**
1. **CORS Errors**: Update CORS origins in backend
2. **Build Failures**: Check Node.js version (use 16.x)
3. **Database Connection**: Verify connection string format
4. **Environment Variables**: Ensure all variables are set

#### **Useful Commands:**
```bash
# View logs
az webapp log tail --name your-backend-app --resource-group receipt-generator-rg

# Restart app
az webapp restart --name your-backend-app --resource-group receipt-generator-rg

# Check app status
az webapp show --name your-backend-app --resource-group receipt-generator-rg
```

### **8. Next Steps**
1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring with Application Insights
4. Configure backup and disaster recovery

---

**Need Help?** Check the full `AZURE_DEPLOYMENT_GUIDE.md` for detailed instructions. 