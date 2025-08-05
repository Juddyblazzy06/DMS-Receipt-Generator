const mongoose = require('mongoose');
const Receipt = require('./models/Receipt');
require('dotenv').config({ path: './config.env' });

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/receipt-generator');
    console.log('Connected to MongoDB');

    // Delete all receipts
    const deleteResult = await Receipt.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} receipts`);

    // Test the getNextReceiptNumber function
    const nextNumber = await Receipt.getNextReceiptNumber();
    console.log('Next receipt number after reset:', nextNumber);

    // Create a test receipt
    const testReceipt = new Receipt({
      receiptNumber: nextNumber,
      studentName: 'Test Student',
      classLevel: 'Primary 5',
      term: 'First Term',
      session: '2023/2024',
      paymentMethod: 'Cash',
      feeItems: [
        { title: 'Tuition', amount: 50000 },
        { title: 'Uniform', amount: 15000 }
      ],
      totalAmount: 65000,
      receiptStyle: {
        primaryColor: '#000000'
      }
    });

    const savedReceipt = await testReceipt.save();
    console.log('Test receipt created successfully:', savedReceipt.receiptNumber);

    // Test getting next number again
    const nextNumber2 = await Receipt.getNextReceiptNumber();
    console.log('Next receipt number after creating test:', nextNumber2);

    // Clean up test receipt
    await Receipt.findByIdAndDelete(savedReceipt._id);
    console.log('Test receipt cleaned up');

    console.log('✅ Database reset successful!');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetDatabase(); 