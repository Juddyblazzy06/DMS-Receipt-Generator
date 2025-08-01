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
      await receiptAPI.create(receiptData);
      navigate('/');
    } catch (err) {
      setError('Failed to create receipt. Please try again.');
      console.error('Error creating receipt:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Create New Receipt</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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