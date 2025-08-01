# 🚀 School Fee Receipt Generator - Quick Start

## ✅ What We've Built

A complete **MERN stack application** for Nigerian schools to generate professional school fee receipts with:

- ✅ **Full CRUD operations** (Create, Read, Update, Delete receipts)
- ✅ **PDF generation** with school branding that matches the UI exactly
- ✅ **Naira currency formatting** (₦)
- ✅ **Responsive design** for desktop and mobile
- ✅ **Custom styling** (colors, logos, footer notes)
- ✅ **Multiple fee items** (Tuition, Uniform, Books, etc.)
- ✅ **Auto-calculation** of totals
- ✅ **Professional UI** with clean design

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Puppeteer for PDF generation (matches UI exactly)
- CORS for API access

**Frontend:**
- React.js with React Router
- Axios for API calls
- CSS3 for styling
- Responsive design

## 🚀 Run the Application

### Step 1: Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system.

### Step 3: Start the Application
```bash
# From the root directory
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 🎯 How to Use

1. **Create a Receipt**:
   - Click "Create New Receipt"
   - Fill in student details (name, ID, class, term, session)
   - Add fee items (Tuition, Uniform, Books, etc.)
   - Customize styling (school colors, logo, footer)
   - Click "Create Receipt"

2. **View Receipts**:
   - See all receipts in a table
   - Click "View" to see receipt details
   - Click "Edit" to modify receipts
   - Click "PDF" to download as PDF
   - Click "Delete" to remove receipts

3. **Download PDF**:
   - Professional PDF that matches the UI exactly
   - Proper Naira formatting
   - Print-ready format with school branding

## 📁 Project Structure

```
receipt-generator/
├── server/                 # Backend
│   ├── models/Receipt.js   # MongoDB schema
│   ├── routes/receipts.js  # API endpoints
│   ├── utils/pdfGenerator.js # PDF generation with Puppeteer
│   └── server.js           # Express server
├── client/                 # Frontend
│   ├── src/components/     # React components
│   ├── src/services/       # API services
│   ├── src/utils/          # Utility functions
│   └── public/             # Static files
└── README.md              # Full documentation
```

## 🔧 API Endpoints

- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt
- `GET /api/receipts/:id` - Get single receipt
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Delete receipt
- `GET /api/receipts/:id/pdf` - Download PDF

## 🎨 Features

- **Student Information**: Name, ID, Class, Term, Session
- **Fee Breakdown**: Multiple fee items with amounts
- **Styling Options**: Custom colors, school logo, footer
- **PDF Export**: Professional receipts with branding that matches the UI
- **Responsive Design**: Works on all devices
- **Form Validation**: Real-time validation
- **Naira Formatting**: Proper currency display

## 🚀 Ready to Deploy

The application is production-ready and can be deployed to:
- **Backend**: Heroku, Railway, DigitalOcean (note: Puppeteer may need additional setup)
- **Frontend**: Netlify, Vercel, GitHub Pages

---

**🎉 Your School Fee Receipt Generator is ready to use!** 