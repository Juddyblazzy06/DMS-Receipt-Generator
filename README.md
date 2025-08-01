# School Fee Receipt Generator

A comprehensive MERN stack application designed for Nigerian primary and secondary schools to generate, manage, and download school fee receipts in PDF format.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete receipts
- **PDF Generation**: Download receipts as professional PDF documents that match the UI exactly
- **Nigerian School Focus**: Designed for Nigerian primary and secondary schools
- **Customizable Styling**: School branding with custom colors and logos
- **Responsive Design**: Works on desktop and mobile devices
- **Naira Currency**: Proper formatting for Nigerian Naira (₦)
- **Multiple Fee Items**: Add various fee types (Tuition, Uniform, Books, etc.)
- **Auto-calculation**: Automatic total calculation from fee items

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Puppeteer** for PDF generation (matches UI exactly)
- **CORS** for cross-origin requests

### Frontend
- **React.js** with React Router
- **Axios** for API communication
- **CSS3** for styling
- **Responsive design**

## 📁 Project Structure

```
receipt-generator/
├── server/                 # Backend (Node.js/Express)
│   ├── models/
│   │   └── Receipt.js     # MongoDB schema
│   ├── routes/
│   │   └── receipts.js    # API routes
│   ├── utils/
│   │   ├── pdfGenerator.js # PDF generation with Puppeteer
│   │   └── formatters.js   # Utility functions
│   ├── config.env         # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server
└── client/                # Frontend (React)
    ├── public/
    │   └── index.html     # Main HTML file
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API services
    │   ├── utils/         # Utility functions
    │   ├── App.js         # Main React app
    │   └── index.js       # React entry point
    └── package.json       # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd receipt-generator
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # In server/config.env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/receipt-generator
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend application**
   ```bash
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📋 API Endpoints

### Receipts
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get single receipt
- `POST /api/receipts` - Create new receipt
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Delete receipt
- `GET /api/receipts/:id/pdf` - Download receipt as PDF

## 🎨 Features in Detail

### Receipt Management
- **Student Information**: Name, ID, Class Level, Term, Session
- **Payment Details**: Payment method and fee breakdown
- **Styling Options**: Custom colors, school logo, footer notes
- **PDF Export**: Professional PDF generation with school branding that matches the UI exactly

### User Interface
- **Clean Design**: White background with black text
- **Responsive Layout**: Works on all device sizes
- **Intuitive Navigation**: Easy-to-use interface
- **Form Validation**: Real-time validation and error messages

### Data Structure
```javascript
{
  studentName: "John Doe",
  studentID: "STU001",
  classLevel: "Primary 5",
  term: "First Term",
  session: "2023/2024",
  paymentMethod: "Bank Transfer",
  feeItems: [
    { title: "Tuition", amount: 50000 },
    { title: "Uniform", amount: 15000 }
  ],
  totalAmount: 65000,
  receiptStyle: {
    logoUrl: "https://example.com/logo.png",
    primaryColor: "#000000",
    footerNote: "Thank you for your payment"
  }
}
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGO_URI` in `server/config.env`
3. Ensure MongoDB is running

### Customization
- **School Branding**: Update colors and logo in receipt styling
- **Fee Items**: Add/remove fee categories as needed
- **Class Levels**: Modify class options in the form
- **PDF Layout**: Customize PDF generation in `server/utils/pdfGenerator.js`

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update CORS settings if needed
4. **Note**: Puppeteer requires additional setup on some hosting platforms

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Update API base URL in `client/src/services/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ for Nigerian Schools** 