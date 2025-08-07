const { formatNaira, formatDate } = require('./formatters');

const generatePDF = async (receipt) => {
  try {
    // Generate HTML content
    const htmlContent = generateReceiptHTML(receipt);
    
    // For now, return HTML content that can be converted to PDF on the client side
    // This avoids heavy server-side dependencies
    return {
      type: 'html',
      content: htmlContent,
      filename: `receipt-${receipt.receiptNumber}.html`
    };
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

const generateReceiptHTML = (receipt) => {
  const {
    receiptNumber,
    studentName,
    classLevel,
    term,
    session,
    paymentMethod,
    feeItems,
    totalAmount,
    receiptStyle,
    createdAt
  } = receipt;

  const { logoUrl, primaryColor = '#000000', footerNote = '' } = receiptStyle || {};

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>School Fee Receipt</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .receipt-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          border: 2px solid ${primaryColor};
          background: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .school-name {
          font-size: 24px;
          font-weight: bold;
          color: ${primaryColor};
          margin-bottom: 10px;
        }
        
        .receipt-title {
          font-size: 20px;
          font-weight: bold;
          color: ${primaryColor};
          margin-bottom: 20px;
        }
        
        .logo {
          max-height: 80px;
          margin-bottom: 20px;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: ${primaryColor};
          border-bottom: 2px solid ${primaryColor};
          padding-bottom: 8px;
          margin-bottom: 20px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
        }
        
        .info-label {
          font-weight: bold;
          margin-right: 10px;
          min-width: 120px;
        }
        
        .info-value {
          color: #333;
        }
        
        .fee-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .fee-table th {
          background-color: ${primaryColor};
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        
        .fee-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        
        .fee-table tr:last-child td {
          border-bottom: 2px solid ${primaryColor};
          font-weight: bold;
          background-color: #f8f9fa;
        }
        
        .total-row {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          border-top: 1px solid ${primaryColor};
          padding-top: 20px;
        }
        
        .footer-note {
          font-style: italic;
          color: #666;
          margin-bottom: 10px;
        }
        
        .generated-date {
          font-size: 12px;
          color: #999;
        }
        
        .amount {
          text-align: right;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: ${primaryColor};
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .print-button:hover {
          opacity: 0.8;
        }
        
        @media print {
          .print-button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">Print Receipt</button>
      
      <div class="receipt-container">
        <!-- Header -->
        <div class="header">
          <h1 class="school-name">DELTOS MODEL SCHOOL</h1>
          <h2 class="receipt-title">SCHOOL FEE RECEIPT</h2>
          ${logoUrl ? `<img src="${logoUrl}" alt="School Logo" class="logo" onerror="this.style.display='none'">` : ''}
        </div>
        
        <!-- Student Information -->
        <div class="section">
          <h2 class="section-title">STUDENT INFORMATION</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Receipt Number:</span>
              <span class="info-value">${receiptNumber.toString().padStart(4, '0')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Student Name:</span>
              <span class="info-value">${studentName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Class Level:</span>
              <span class="info-value">${classLevel}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Term:</span>
              <span class="info-value">${term}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Session:</span>
              <span class="info-value">${session}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <!-- Fee Breakdown -->
        <div class="section">
          <h2 class="section-title">FEE BREAKDOWN</h2>
          <table class="fee-table">
            <thead>
              <tr>
                <th>Item</th>
                <th class="amount" style="text-align: right;">Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              ${feeItems.map(item => `
                <tr>
                  <td>${item.title}</td>
                  <td class="amount">${formatNaira(item.amount)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td><strong>TOTAL AMOUNT</strong></td>
                <td class="amount"><strong>${formatNaira(totalAmount)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          ${footerNote ? `<div class="footer-note">${footerNote}</div>` : ''}
          <div class="generated-date">
            Generated on: ${formatDate(createdAt)}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { generatePDF }; 