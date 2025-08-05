const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const { generatePDF } = require('../utils/simplePdfGenerator');

// Get next receipt number (for debugging)
router.get('/next-number', async (req, res) => {
  try {
    const nextNumber = await Receipt.getNextReceiptNumber();
    res.json({ nextReceiptNumber: nextNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new receipt
router.post('/', async (req, res) => {
  try {
    const { studentName, classLevel, term, session, paymentMethod, feeItems, receiptStyle } = req.body;
    
    // Validate required fields
    if (!studentName || !classLevel || !term || !session || !paymentMethod) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    if (!feeItems || feeItems.length === 0) {
      return res.status(400).json({ message: 'At least one fee item is required' });
    }
    
    // Calculate total amount
    const totalAmount = feeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Total amount must be greater than 0' });
    }
    
    // Get next receipt number with validation
    let nextReceiptNumber;
    try {
      nextReceiptNumber = await Receipt.getNextReceiptNumber();
      
      // Validate the receipt number
      if (!nextReceiptNumber || isNaN(nextReceiptNumber) || nextReceiptNumber < 1001) {
        nextReceiptNumber = 1001; // Fallback to 1001
      }
    } catch (error) {
      console.error('Error getting next receipt number:', error);
      nextReceiptNumber = 1001; // Fallback to 1001
    }
    
    console.log('Creating receipt with number:', nextReceiptNumber);
    
    const receipt = new Receipt({
      receiptNumber: nextReceiptNumber,
      studentName,
      classLevel,
      term,
      session,
      paymentMethod,
      feeItems,
      totalAmount,
      receiptStyle: receiptStyle || { primaryColor: '#000000' }
    });
    
    const savedReceipt = await receipt.save();
    console.log('Receipt created successfully:', savedReceipt.receiptNumber);
    res.status(201).json(savedReceipt);
  } catch (error) {
    console.error('Error creating receipt:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Receipt number already exists. Please try again.' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: validationErrors.join(', ') });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Get all receipts
router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single receipt
router.get('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update receipt
router.put('/:id', async (req, res) => {
  try {
    const { studentName, classLevel, term, session, paymentMethod, feeItems, receiptStyle } = req.body;
    
    // Calculate total amount
    const totalAmount = feeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      {
        studentName,
        classLevel,
        term,
        session,
        paymentMethod,
        feeItems,
        totalAmount,
        receiptStyle
      },
      { new: true }
    );
    
    if (!updatedReceipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    res.json(updatedReceipt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete receipt
router.delete('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate HTML for printing
router.get('/:id/pdf', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    const result = await generatePDF(receipt);
    
    if (result.type === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
      res.send(result.content);
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=receipt-${receipt.receiptNumber}.pdf`);
      res.send(result);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Failed to generate receipt' });
  }
});

module.exports = router; 