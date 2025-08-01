# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service
- **Mac**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### 3. Configure Environment
Edit `server/config.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/receipt-generator
```

### 4. Start the Application
```bash
# Start both server and client
npm run dev

# Or start them separately:
# Terminal 1: npm run server
# Terminal 2: npm run client
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 First Steps

1. **Create a Receipt**: Click "Create New Receipt" and fill in student details
2. **Add Fee Items**: Include tuition, uniform, books, etc.
3. **Customize Styling**: Set school colors and logo
4. **Generate PDF**: Download the receipt as a professional PDF

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check if the port 27017 is available
- Verify the connection string in `config.env`

### Port Conflicts
- Change the port in `server/config.env` if 5000 is in use
- Update the proxy in `client/package.json` accordingly

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires v14+)

## 📚 Next Steps

- Customize the receipt styling for your school
- Add more fee categories as needed
- Deploy to production for school use
- Set up user authentication if required

---

**Need Help?** Check the main README.md for detailed documentation. 