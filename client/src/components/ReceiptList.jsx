import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { receiptAPI } from '../services/api';
import { formatNaira, formatDate } from '../utils/formatters';

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await receiptAPI.getAll();
      setReceipts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch receipts');
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        await receiptAPI.delete(id);
        setReceipts(receipts.filter(receipt => receipt._id !== id));
      } catch (err) {
        setError('Failed to delete receipt');
        console.error('Error deleting receipt:', err);
      }
    }
  };

  const handleDownloadReceipt = async (id) => {
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
        link.download = `receipt-${id}.html`;
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
        link.download = `receipt-${id}.pdf`;
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

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading receipts...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button onClick={fetchReceipts} className="btn btn-primary" style={{ marginLeft: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>All Receipts</h2>
        <Link to="/new" className="btn btn-primary">
          Create New Receipt
        </Link>
      </div>

      {receipts.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No receipts found</h3>
            <p>Create your first receipt to get started.</p>
            <Link to="/new" className="btn btn-primary">
              Create Receipt
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Term</th>
                <th>Session</th>
                <th>Total Amount</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt._id}>
                  <td>
                    <strong>{receipt.receiptNumber?.toString().padStart(4, '0') || 'N/A'}</strong>
                  </td>
                  <td>{receipt.studentName}</td>
                  <td>{receipt.classLevel}</td>
                  <td>{receipt.term}</td>
                  <td>{receipt.session}</td>
                  <td>{formatNaira(receipt.totalAmount)}</td>
                  <td>{formatDate(receipt.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <Link
                        to={`/view/${receipt._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit/${receipt._id}`}
                        className="btn btn-primary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDownloadReceipt(receipt._id)}
                        className="btn btn-success"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                        title="Download printable receipt"
                      >
                        Print
                      </button>
                      <button
                        onClick={() => handleDelete(receipt._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceiptList; 