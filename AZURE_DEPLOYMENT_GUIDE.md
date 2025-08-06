# 🚀 Azure Deployment Guide for School Fee Receipt Generator

## 📋 **Prerequisites**

### **Azure Account Setup**
1. **Create Azure Account**: [portal.azure.com](https://portal.azure.com)
2. **Install Azure CLI**: [docs.microsoft.com/azure/cli](https://docs.microsoft.com/azure/cli)
3. **Install Git**: [git-scm.com](https://git-scm.com)

### **Required Azure Services**
- **Azure App Service** (for backend)
- **Azure Static Web Apps** (for frontend)
- **Azure Cosmos DB** (for MongoDB)
- **Azure Application Insights** (optional, for monitoring)

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Static Web    │    │   App Service   │    │   Cosmos DB     │
│   Apps          │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Step-by-Step Deployment**

### **Step 1: Prepare Your Code**

#### **1.1 Update Environment Variables**
Create `server/config.production.js`:
```javascript
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: 'production'
};
```

#### **1.2 Update Frontend API URL**
Update `client/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-app.azurewebsites.net/api';
```

#### **1.3 Create Azure Configuration Files**

**Create `.github/workflows/azure-deploy.yml`**:
```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Deploy to Azure App Service
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'your-backend-app-name'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./server

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Build React App
      run: |
        cd client
        npm install
        npm run build
    
    - name: Deploy to Azure Static Web Apps
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        app_location: "/client/build"
        api_location: ""
        output_location: ""
```

### **Step 2: Deploy Backend to Azure App Service**

#### **2.1 Create App Service**
```bash
# Login to Azure
az login

# Create resource group
az group create --name receipt-generator-rg --location "East US"

# Create App Service Plan
az appservice plan create \
  --name receipt-generator-plan \
  --resource-group receipt-generator-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name your-backend-app-name \
  --resource-group receipt-generator-rg \
  --plan receipt-generator-plan \
  --runtime "NODE|16-lts"
```

#### **2.2 Configure Environment Variables**
```bash
# Set environment variables
az webapp config appsettings set \
  --name your-backend-app-name \
  --resource-group receipt-generator-rg \
  --settings \
    NODE_ENV=production \
    MONGO_URI="your-cosmos-db-connection-string" \
    PORT=5000
```

#### **2.3 Deploy Backend Code**
```bash
# Navigate to server directory
cd server

# Deploy using Azure CLI
az webapp deployment source config-local-git \
  --name your-backend-app-name \
  --resource-group receipt-generator-rg

# Get deployment URL
az webapp deployment list-publishing-credentials \
  --name your-backend-app-name \
  --resource-group receipt-generator-rg

# Deploy code
git init
git add .
git commit -m "Initial backend deployment"
git remote add azure <deployment-url>
git push azure main
```

### **Step 3: Deploy Frontend to Azure Static Web Apps**

#### **3.1 Create Static Web App**
```bash
# Create Static Web App
az staticwebapp create \
  --name your-frontend-app-name \
  --resource-group receipt-generator-rg \
  --source https://github.com/your-username/your-repo \
  --location "East US" \
  --branch main \
  --app-location "/client" \
  --api-location "" \
  --output-location "build"
```

#### **3.2 Configure Build Settings**
In Azure Portal:
1. Go to your Static Web App
2. Navigate to "Configuration" → "Build Configuration"
3. Set build configuration:
   ```json
   {
     "appLocation": "/client",
     "apiLocation": "",
     "outputLocation": "build",
     "appBuildCommand": "npm run build",
     "apiBuildCommand": "",
     "routes": {
       "/*": {
         "serve": "/index.html",
         "statusCode": 200
       }
     }
   }
   ```

#### **3.3 Set Environment Variables**
In Azure Portal:
1. Go to "Configuration" → "Application settings"
2. Add environment variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-app-name.azurewebsites.net/api`

### **Step 4: Set Up Azure Cosmos DB (MongoDB)**

#### **4.1 Create Cosmos DB Account**
```bash
# Create Cosmos DB account
az cosmosdb create \
  --name your-cosmos-db-name \
  --resource-group receipt-generator-rg \
  --kind MongoDB \
  --capabilities EnableMongo

# Get connection string
az cosmosdb keys list \
  --name your-cosmos-db-name \
  --resource-group receipt-generator-rg \
  --type connection-strings
```

#### **4.2 Update Backend Environment**
```bash
# Update backend with Cosmos DB connection
az webapp config appsettings set \
  --name your-backend-app-name \
  --resource-group receipt-generator-rg \
  --settings \
    MONGO_URI="your-cosmos-db-connection-string"
```

### **Step 5: Configure CORS and Networking**

#### **5.1 Update Backend CORS**
Update `server/server.js`:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-app-name.azurestaticapps.net']
    : 'http://localhost:3000',
  credentials: true
}));
```

#### **5.2 Configure Custom Domains (Optional)**
```bash
# Add custom domain to backend
az webapp config hostname add \
  --webapp-name your-backend-app-name \
  --resource-group receipt-generator-rg \
  --hostname api.yourdomain.com

# Add custom domain to frontend
az staticwebapp hostname add \
  --name your-frontend-app-name \
  --resource-group receipt-generator-rg \
  --hostname www.yourdomain.com
```

## 🔧 **Configuration Files**

### **Backend: `server/web.config`**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin" />
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

### **Frontend: `client/staticwebapp.config.json`**
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  }
}
```

## 📊 **Cost Estimation**

### **Free Tier (12 months)**
- **App Service**: 1 F1 instance (free)
- **Static Web Apps**: 2 GB storage (free)
- **Cosmos DB**: 1000 RU/s, 25 GB storage (free)

### **Paid Tier (after 12 months)**
- **App Service**: ~$13/month (B1 tier)
- **Static Web Apps**: ~$9/month
- **Cosmos DB**: ~$24/month (1000 RU/s)

**Total**: ~$46/month

## 🚀 **Deployment Commands Summary**

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name receipt-generator-rg --location "East US"

# 3. Create backend
az appservice plan create --name receipt-generator-plan --resource-group receipt-generator-rg --sku B1 --is-linux
az webapp create --name your-backend-app-name --resource-group receipt-generator-rg --plan receipt-generator-plan --runtime "NODE|16-lts"

# 4. Create frontend
az staticwebapp create --name your-frontend-app-name --resource-group receipt-generator-rg --source https://github.com/your-username/your-repo --location "East US" --branch main --app-location "/client" --api-location "" --output-location "build"

# 5. Create database
az cosmosdb create --name your-cosmos-db-name --resource-group receipt-generator-rg --kind MongoDB --capabilities EnableMongo

# 6. Set environment variables
az webapp config appsettings set --name your-backend-app-name --resource-group receipt-generator-rg --settings NODE_ENV=production MONGO_URI="your-cosmos-db-connection-string" PORT=5000
```

## 🔍 **Testing Your Deployment**

### **Backend Health Check**
```bash
curl https://your-backend-app-name.azurewebsites.net/health
```

### **Frontend Test**
1. Visit: `https://your-frontend-app-name.azurestaticapps.net`
2. Create a receipt
3. Test PDF download
4. Verify all CRUD operations

## 🛠️ **Monitoring and Logs**

### **View Logs**
```bash
# Backend logs
az webapp log tail --name your-backend-app-name --resource-group receipt-generator-rg

# Frontend logs (in Azure Portal)
# Go to Static Web App → Monitoring → Logs
```

### **Application Insights (Optional)**
```bash
# Create Application Insights
az monitor app-insights component create \
  --app your-app-insights-name \
  --location "East US" \
  --resource-group receipt-generator-rg \
  --application-type web
```

## 🎉 **Your App is Now Live!**

- **Frontend**: `https://your-frontend-app-name.azurestaticapps.net`
- **Backend**: `https://your-backend-app-name.azurewebsites.net`
- **Database**: Azure Cosmos DB (MongoDB)

---

**Need Help?** Check Azure documentation or contact Azure support. 