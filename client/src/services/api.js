import axios from 'axios';
const BACKEND_URL= 'https://receipt-gen-dqhubzbab2d6hbgj.southafricanorth-01.azurewebsites.net/' ||'https://dms-receipt-generator-production.up.railway.app/api';

const API_BASE_URL = BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const receiptAPI = {
  // Get all receipts
  getAll: () => api.get('/receipts'),
  
  // Get single receipt
  getById: (id) => api.get(`/receipts/${id}`),
  
  // Create new receipt
  create: (receiptData) => api.post('/receipts', receiptData),
  
  // Update receipt
  update: (id, receiptData) => api.put(`/receipts/${id}`, receiptData),
  
  // Delete receipt
  delete: (id) => api.delete(`/receipts/${id}`),
  
  // Download PDF
  downloadPDF: (id) => api.get(`/receipts/${id}/pdf`, {
    responseType: 'blob'
  }),
};

export default api; 