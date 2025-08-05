import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { receiptAPI } from '../services/api';
import ReceiptForm from './ReceiptForm';

const NewReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (receiptData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Submitting receipt data:', receiptData);
      
      const response = await receiptAPI.create(receiptData);
      console.log('Receipt created successfully:', response.data);
      
      navigate('/');
    } catch (err) {
      console.error('Error creating receipt:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || 'Failed to create receipt. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setError('Failed to create receipt. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Create New Receipt</h2>
        {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError(null)} 
              className="btn btn-sm btn-outline-danger" 
              style={{ marginLeft: '10px' }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <ReceiptForm onSubmit={handleSubmit} isEditing={false} />

      {loading && (
        <div className="alert alert-info">
          Creating receipt...
        </div>
      )}
    </div>
  );
};

export default NewReceipt; 