// Format Naira currency
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate total from fee items
const calculateTotal = (feeItems) => {
  return feeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
};

module.exports = { formatNaira, formatDate, calculateTotal }; 