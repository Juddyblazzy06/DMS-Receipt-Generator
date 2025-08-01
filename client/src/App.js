import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReceiptList from './components/ReceiptList';
import NewReceipt from './components/NewReceipt';
import EditReceipt from './components/EditReceipt';
import ViewReceipt from './components/ViewReceipt';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>School Fee Receipt Generator</h1>
              <ul className="navbar-nav">
                <li><Link to="/">Receipts</Link></li>
                <li><Link to="/new">New Receipt</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<ReceiptList />} />
            <Route path="/new" element={<NewReceipt />} />
            <Route path="/edit/:id" element={<EditReceipt />} />
            <Route path="/view/:id" element={<ViewReceipt />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 