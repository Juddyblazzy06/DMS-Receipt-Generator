#!/bin/bash

echo "🚀 Azure Deployment Script for School Fee Receipt Generator"
echo "=========================================================="

# Configuration
RESOURCE_GROUP="receipt-generator-rg"
LOCATION="East US"
BACKEND_APP_NAME="receipt-generator-backend"
FRONTEND_APP_NAME="receipt-generator-frontend"
COSMOS_DB_NAME="receipt-generator-db"
PLAN_NAME="receipt-generator-plan"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first:"
    echo "https://docs.microsoft.com/azure/cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    print_warning "You are not logged into Azure. Please login first:"
    az login
fi

echo ""
echo "📋 Deployment Steps:"
echo "1. Create Resource Group"
echo "2. Create App Service Plan"
echo "3. Create Backend App Service"
echo "4. Create Frontend Static Web App"
echo "5. Create Cosmos DB"
echo "6. Configure Environment Variables"
echo "7. Deploy Code"
echo ""

read -p "Do you want to proceed with deployment? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled."
    exit 0
fi

echo ""
print_status "Starting Azure deployment..."

# Step 1: Create Resource Group
echo ""
print_status "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Step 2: Create App Service Plan
echo ""
print_status "Creating App Service Plan..."
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Step 3: Create Backend App Service
echo ""
print_status "Creating Backend App Service..."
az webapp create \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --runtime "NODE|16-lts"

# Step 4: Create Frontend Static Web App
echo ""
print_status "Creating Frontend Static Web App..."
az staticwebapp create \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/your-username/your-repo \
  --location "$LOCATION" \
  --branch main \
  --app-location "/client" \
  --api-location "" \
  --output-location "build"

# Step 5: Create Cosmos DB
echo ""
print_status "Creating Cosmos DB..."
az cosmosdb create \
  --name $COSMOS_DB_NAME \
  --resource-group $RESOURCE_GROUP \
  --kind MongoDB \
  --capabilities EnableMongo

# Step 6: Get Cosmos DB Connection String
echo ""
print_status "Getting Cosmos DB Connection String..."
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list \
  --name $COSMOS_DB_NAME \
  --resource-group $RESOURCE_GROUP \
  --type connection-strings \
  --query "connectionStrings[0].connectionString" \
  --output tsv)

# Step 7: Configure Backend Environment Variables
echo ""
print_status "Configuring Backend Environment Variables..."
az webapp config appsettings set \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    NODE_ENV=production \
    MONGO_URI="$COSMOS_CONNECTION_STRING" \
    PORT=5000

# Step 8: Get URLs
BACKEND_URL="https://$BACKEND_APP_NAME.azurewebsites.net"
FRONTEND_URL="https://$FRONTEND_APP_NAME.azurestaticapps.net"

echo ""
print_status "Deployment completed successfully!"
echo ""
echo "🌐 Your Application URLs:"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo ""

echo "📋 Next Steps:"
echo "1. Update your frontend API URL to: $BACKEND_URL/api"
echo "2. Deploy your code to GitHub"
echo "3. Configure GitHub Actions for automatic deployment"
echo ""

echo "🔧 Manual Configuration Required:"
echo "1. Update client/src/services/api.js with your backend URL"
echo "2. Push code to GitHub repository"
echo "3. Configure Static Web App build settings in Azure Portal"
echo ""

echo "💰 Cost Estimation:"
echo "- App Service (B1): ~$13/month"
echo "- Static Web Apps: ~$9/month"
echo "- Cosmos DB: ~$24/month"
echo "- Total: ~$46/month"
echo ""

echo "📞 Need Help?"
echo "- Azure Documentation: https://docs.microsoft.com/azure"
echo "- Azure Support: https://azure.microsoft.com/support"
echo ""

print_status "Azure deployment script completed!" 