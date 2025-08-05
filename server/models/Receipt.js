const mongoose = require("mongoose");

const feeItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
});

const receiptSchema = new mongoose.Schema({
  receiptNumber: { 
    type: Number, 
    required: true,
    unique: true
  },
  studentName: { type: String, required: true },
  classLevel: {
    type: String,
    required: true,
    enum: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]
  },
  term: {
    type: String,
    required: true,
    enum: ["First Term", "Second Term", "Third Term"]
  },
  session: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  feeItems: [feeItemSchema],
  totalAmount: { type: Number, required: true },
  receiptStyle: {
    logoUrl: String,
    primaryColor: { type: String, default: "#000000" },
    footerNote: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Static method to get next receipt number
receiptSchema.statics.getNextReceiptNumber = async function() {
  try {
    const lastReceipt = await this.findOne().sort({ receiptNumber: -1 });
    
    if (!lastReceipt || !lastReceipt.receiptNumber) {
      return 1001; // Start from 1001 for 4-digit format
    }
    
    const nextNumber = lastReceipt.receiptNumber + 1;
    
    // Ensure it's a valid number
    if (isNaN(nextNumber) || nextNumber < 1001) {
      return 1001;
    }
    
    return nextNumber;
  } catch (error) {
    console.error('Error getting next receipt number:', error);
    return 1001; // Fallback to 1001
  }
};

module.exports = mongoose.model("Receipt", receiptSchema); 