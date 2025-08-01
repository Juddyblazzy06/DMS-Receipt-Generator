const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const { generatePDF } = require('../utils/pdfGenerator');

// Create new receipt
router.post('/', async (req, res) => {
  try {
    const { studentName, studentID, classLevel, term, session, paymentMethod, feeItems, receiptStyle } = req.body;
    
    // Calculate total amount
    const totalAmount = feeItems.reduce((sum, item) => sum + item.amount, 0);
    
    const receipt = new Receipt({
      studentName,
      studentID,
      classLevel,
      term,
      session,
      paymentMethod,
      feeItems,
      totalAmount,
      receiptStyle: receiptStyle || { primaryColor: '#000000' }
    });
    
    const savedReceipt = await receipt.save();
    res.status(201).json(savedReceipt);
  } catch (error) {
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
    const { studentName, studentID, classLevel, term, session, paymentMethod, feeItems, receiptStyle } = req.body;
    
    // Calculate total amount
    const totalAmount = feeItems.reduce((sum, item) => sum + item.amount, 0);
    
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      {
        studentName,
        studentID,
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

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    const pdfBuffer = await generatePDF(receipt);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${receipt.studentID}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

module.exports = router; 