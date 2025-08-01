const mongoose = require("mongoose");

const feeItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
});

const receiptSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentID: { type: String, required: true },
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

module.exports = mongoose.model("Receipt", receiptSchema); 