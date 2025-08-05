import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { receiptAPI } from '../services/api';
import { formatNaira, formatDate } from '../utils/formatters';

const ViewReceipt = () => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const response = await receiptAPI.getById(id);
      setReceipt(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch receipt. It may not exist.');
      console.error('Error fetching receipt:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await receiptAPI.downloadPDF(id);
      
      // Check if it's HTML content
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        // Handle HTML download
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${receipt.receiptNumber}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Handle PDF download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${receipt.receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError('Failed to download receipt');
      console.error('Error downloading receipt:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading receipt...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginLeft: '10px' }}>
          Back to Receipts
        </button>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="alert alert-danger">
        Receipt not found
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginLeft: '10px' }}>
          Back to Receipts
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Receipt Details</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-secondary">
              Print
            </button>
            <button onClick={handleDownloadReceipt} className="btn btn-success">
              Download Receipt
            </button>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to List
            </button>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      {/* Receipt Display */}
      <div 
        className="card" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          border: `2px solid ${receipt.receiptStyle?.primaryColor || '#000000'}`,
          backgroundColor: 'white'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: receipt.receiptStyle?.primaryColor || '#000000',
            marginBottom: '10px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            DELTOS MODEL SCHOOL
          </h2>
          <h1 style={{ 
            color: receipt.receiptStyle?.primaryColor || '#000000',
            marginBottom: '10px',
            fontSize: '20px'
          }}>
            SCHOOL FEE RECEIPT
          </h1>
          {receipt.receiptStyle?.logoUrl && (
            <div style={{ marginBottom: '10px' }}>
              <img 
                src={receipt.receiptStyle.logoUrl} 
                alt="School Logo" 
                style={{ maxHeight: '60px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Student Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            color: receipt.receiptStyle?.primaryColor || '#000000',
            borderBottom: `2px solid ${receipt.receiptStyle?.primaryColor || '#000000'}`,
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>
            STUDENT INFORMATION
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <strong>Receipt Number:</strong> {receipt.receiptNumber?.toString().padStart(4, '0')}
            </div>
            <div>
              <strong>Student Name:</strong> {receipt.studentName}
            </div>
            <div>
              <strong>Class Level:</strong> {receipt.classLevel}
            </div>
            <div>
              <strong>Term:</strong> {receipt.term}
            </div>
            <div>
              <strong>Session:</strong> {receipt.session}
            </div>
            <div>
              <strong>Payment Method:</strong> {receipt.paymentMethod}
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            color: receipt.receiptStyle?.primaryColor || '#000000',
            borderBottom: `2px solid ${receipt.receiptStyle?.primaryColor || '#000000'}`,
            paddingBottom: '5px',
            marginBottom: '15px'
          }}>
            FEE BREAKDOWN
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                backgroundColor: receipt.receiptStyle?.primaryColor || '#000000',
                color: 'white'
              }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Item</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              {receipt.feeItems.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.title}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {formatNaira(item.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ 
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                borderTop: `2px solid ${receipt.receiptStyle?.primaryColor || '#000000'}`
              }}>
                <td style={{ padding: '10px' }}>TOTAL AMOUNT</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  {formatNaira(receipt.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '40px', 
          textAlign: 'center',
          borderTop: `1px solid ${receipt.receiptStyle?.primaryColor || '#000000'}`,
          paddingTop: '20px'
        }}>
          {receipt.receiptStyle?.footerNote && (
            <p style={{ marginBottom: '10px', fontStyle: 'italic' }}>
              {receipt.receiptStyle.footerNote}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#666' }}>
            Generated on: {formatDate(receipt.createdAt)}
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .btn, nav, .container > div:first-child {
            display: none !important;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewReceipt; 