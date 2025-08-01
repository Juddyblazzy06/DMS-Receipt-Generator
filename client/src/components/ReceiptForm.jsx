import React, { useState, useEffect } from 'react';
import { calculateTotal } from '../utils/formatters';

const ReceiptForm = ({ receipt, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentID: '',
    classLevel: '',
    term: '',
    session: '',
    paymentMethod: '',
    feeItems: [{ title: '', amount: '' }],
    receiptStyle: {
      logoUrl: '',
      primaryColor: '#000000',
      footerNote: ''
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (receipt) {
      setFormData({
        studentName: receipt.studentName || '',
        studentID: receipt.studentID || '',
        classLevel: receipt.classLevel || '',
        term: receipt.term || '',
        session: receipt.session || '',
        paymentMethod: receipt.paymentMethod || '',
        feeItems: receipt.feeItems?.length > 0 ? receipt.feeItems : [{ title: '', amount: '' }],
        receiptStyle: {
          logoUrl: receipt.receiptStyle?.logoUrl || '',
          primaryColor: receipt.receiptStyle?.primaryColor || '#000000',
          footerNote: receipt.receiptStyle?.footerNote || ''
        }
      });
    }
  }, [receipt]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReceiptStyleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      receiptStyle: {
        ...prev.receiptStyle,
        [field]: value
      }
    }));
  };

  const handleFeeItemChange = (index, field, value) => {
    const updatedFeeItems = [...formData.feeItems];
    updatedFeeItems[index] = {
      ...updatedFeeItems[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({
      ...prev,
      feeItems: updatedFeeItems
    }));
  };

  const addFeeItem = () => {
    setFormData(prev => ({
      ...prev,
      feeItems: [...prev.feeItems, { title: '', amount: '' }]
    }));
  };

  const removeFeeItem = (index) => {
    if (formData.feeItems.length > 1) {
      const updatedFeeItems = formData.feeItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        feeItems: updatedFeeItems
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.studentID.trim()) newErrors.studentID = 'Student ID is required';
    if (!formData.classLevel) newErrors.classLevel = 'Class level is required';
    if (!formData.term) newErrors.term = 'Term is required';
    if (!formData.session.trim()) newErrors.session = 'Session is required';
    if (!formData.paymentMethod.trim()) newErrors.paymentMethod = 'Payment method is required';

    // Validate fee items
    formData.feeItems.forEach((item, index) => {
      if (!item.title.trim()) {
        newErrors[`feeItem${index}Title`] = 'Fee item title is required';
      }
      if (!item.amount || item.amount <= 0) {
        newErrors[`feeItem${index}Amount`] = 'Fee item amount must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const totalAmount = calculateTotal(formData.feeItems);
      onSubmit({
        ...formData,
        totalAmount
      });
    }
  };

  const totalAmount = calculateTotal(formData.feeItems);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <form onSubmit={handleSubmit} className="card">
        <h2>{isEditing ? 'Edit Receipt' : 'Create New Receipt'}</h2>
        
        {/* Student Information */}
        <div className="form-group">
          <label className="form-label">Student Name *</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            className={`form-control ${errors.studentName ? 'border-danger' : ''}`}
            placeholder="Enter student name"
          />
          {errors.studentName && <div className="alert alert-danger">{errors.studentName}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Student ID *</label>
          <input
            type="text"
            name="studentID"
            value={formData.studentID}
            onChange={handleInputChange}
            className={`form-control ${errors.studentID ? 'border-danger' : ''}`}
            placeholder="Enter student ID"
          />
          {errors.studentID && <div className="alert alert-danger">{errors.studentID}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Class Level *</label>
          <select
            name="classLevel"
            value={formData.classLevel}
            onChange={handleInputChange}
            className={`form-control ${errors.classLevel ? 'border-danger' : ''}`}
          >
            <option value="">Select Class Level</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
            <option value="JSS1">JSS1</option>
            <option value="JSS2">JSS2</option>
            <option value="JSS3">JSS3</option>
            <option value="SS1">SS1</option>
            <option value="SS2">SS2</option>
            <option value="SS3">SS3</option>
          </select>
          {errors.classLevel && <div className="alert alert-danger">{errors.classLevel}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Term *</label>
          <select
            name="term"
            value={formData.term}
            onChange={handleInputChange}
            className={`form-control ${errors.term ? 'border-danger' : ''}`}
          >
            <option value="">Select Term</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
          {errors.term && <div className="alert alert-danger">{errors.term}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Session *</label>
          <input
            type="text"
            name="session"
            value={formData.session}
            onChange={handleInputChange}
            className={`form-control ${errors.session ? 'border-danger' : ''}`}
            placeholder="e.g., 2023/2024"
          />
          {errors.session && <div className="alert alert-danger">{errors.session}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method *</label>
          <input
            type="text"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className={`form-control ${errors.paymentMethod ? 'border-danger' : ''}`}
            placeholder="e.g., Cash, Bank Transfer, etc."
          />
          {errors.paymentMethod && <div className="alert alert-danger">{errors.paymentMethod}</div>}
        </div>

        {/* Fee Items */}
        <div className="form-group">
          <label className="form-label">Fee Items *</label>
          {formData.feeItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleFeeItemChange(index, 'title', e.target.value)}
                className={`form-control ${errors[`feeItem${index}Title`] ? 'border-danger' : ''}`}
                placeholder="Fee item (e.g., Tuition, Uniform)"
                style={{ flex: 2 }}
              />
              <input
                type="number"
                value={item.amount}
                onChange={(e) => handleFeeItemChange(index, 'amount', e.target.value)}
                className={`form-control ${errors[`feeItem${index}Amount`] ? 'border-danger' : ''}`}
                placeholder="Amount (₦)"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => removeFeeItem(index)}
                className="btn btn-danger"
                style={{ width: '40px' }}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addFeeItem} className="btn btn-secondary">
            Add Fee Item
          </button>
        </div>

        {/* Total Amount */}
        <div className="form-group">
          <label className="form-label">Total Amount</label>
          <input
            type="text"
            value={`₦${totalAmount.toLocaleString()}`}
            className="form-control"
            readOnly
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        {/* Receipt Styling */}
        <div className="card">
          <h3>Receipt Styling</h3>
          
          <div className="form-group">
            <label className="form-label">School Logo URL</label>
            <input
              type="url"
              value={formData.receiptStyle.logoUrl}
              onChange={(e) => handleReceiptStyleChange('logoUrl', e.target.value)}
              className="form-control"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Color</label>
            <input
              type="color"
              value={formData.receiptStyle.primaryColor}
              onChange={(e) => handleReceiptStyleChange('primaryColor', e.target.value)}
              className="form-control"
              style={{ width: '100px', height: '40px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Footer Note</label>
            <textarea
              value={formData.receiptStyle.footerNote}
              onChange={(e) => handleReceiptStyleChange('footerNote', e.target.value)}
              className="form-control"
              placeholder="Enter footer note for receipt"
              rows="3"
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Receipt' : 'Create Receipt'}
          </button>
        </div>
      </form>

      {/* Receipt Preview */}
      <div className="card" style={{ height: 'fit-content' }}>
        <h3>Receipt Preview</h3>
        <div 
          style={{ 
            border: `2px solid ${formData.receiptStyle.primaryColor}`,
            padding: '20px',
            backgroundColor: 'white',
            minHeight: '400px'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ 
              color: formData.receiptStyle.primaryColor,
              marginBottom: '5px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              DELTOS MODEL SCHOOL
            </h2>
            <h1 style={{ 
              color: formData.receiptStyle.primaryColor,
              marginBottom: '10px',
              fontSize: '16px'
            }}>
              SCHOOL FEE RECEIPT
            </h1>
            {formData.receiptStyle.logoUrl && (
              <img 
                src={formData.receiptStyle.logoUrl} 
                alt="School Logo" 
                style={{ maxHeight: '40px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Student Information Preview */}
          {formData.studentName && (
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ 
                color: formData.receiptStyle.primaryColor,
                borderBottom: `1px solid ${formData.receiptStyle.primaryColor}`,
                paddingBottom: '3px',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                STUDENT INFORMATION
              </h3>
              <div style={{ fontSize: '12px' }}>
                <div><strong>Student Name:</strong> {formData.studentName}</div>
                <div><strong>Student ID:</strong> {formData.studentID}</div>
                <div><strong>Class Level:</strong> {formData.classLevel}</div>
                <div><strong>Term:</strong> {formData.term}</div>
                <div><strong>Session:</strong> {formData.session}</div>
                <div><strong>Payment Method:</strong> {formData.paymentMethod}</div>
              </div>
            </div>
          )}

          {/* Fee Items Preview */}
          {formData.feeItems.some(item => item.title && item.amount) && (
            <div>
              <h3 style={{ 
                color: formData.receiptStyle.primaryColor,
                borderBottom: `1px solid ${formData.receiptStyle.primaryColor}`,
                paddingBottom: '3px',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                FEE BREAKDOWN
              </h3>
              <div style={{ fontSize: '12px' }}>
                {formData.feeItems.map((item, index) => (
                  item.title && item.amount && (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span>{item.title}</span>
                      <span>₦{item.amount.toLocaleString()}</span>
                    </div>
                  )
                ))}
                {totalAmount > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '5px',
                    borderTop: '1px solid #ddd',
                    paddingTop: '5px',
                    fontWeight: 'bold'
                  }}>
                    <span>TOTAL AMOUNT</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Preview */}
          {formData.receiptStyle.footerNote && (
            <div style={{ 
              marginTop: '15px', 
              textAlign: 'center',
              borderTop: `1px solid ${formData.receiptStyle.primaryColor}`,
              paddingTop: '10px',
              fontSize: '10px',
              fontStyle: 'italic',
              color: '#666'
            }}>
              {formData.receiptStyle.footerNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm; 