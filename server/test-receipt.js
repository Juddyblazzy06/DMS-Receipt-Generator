const mongoose = require('mongoose');
const Receipt = require('./models/Receipt');
require('dotenv').config({ path: './config.env' });

async function testReceiptCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/receipt-generator');
    console.log('Connected to MongoDB');

    // Test getting next receipt number
    const nextNumber = await Receipt.getNextReceiptNumber();
    console.log('Next receipt number:', nextNumber);

    // Test creating a receipt
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
    console.log('Receipt created successfully:', savedReceipt);

    // Clean up - delete the test receipt
    await Receipt.findByIdAndDelete(savedReceipt._id);
    console.log('Test receipt deleted');

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testReceiptCreation(); 