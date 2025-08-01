import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { receiptAPI } from '../services/api';
import ReceiptForm from './ReceiptForm';

const EditReceipt = () => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (receiptData) => {
    try {
      setSaving(true);
      setError(null);
      await receiptAPI.update(id, receiptData);
      navigate('/');
    } catch (err) {
      setError('Failed to update receipt. Please try again.');
      console.error('Error updating receipt:', err);
    } finally {
      setSaving(false);
    }
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
        <h2>Edit Receipt</h2>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <ReceiptForm receipt={receipt} onSubmit={handleSubmit} isEditing={true} />

      {saving && (
        <div className="alert alert-info">
          Updating receipt...
        </div>
      )}
    </div>
  );
};

export default EditReceipt; 