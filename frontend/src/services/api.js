import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// GET /api/suppliers
export const getSuppliers = async () => {
  const response = await api.get('/suppliers');
  return response.data;
};

// POST /api/decision
export const submitInvoice = async (data) => {
  const response = await api.post('/decision', data);
  return response.data;
};

// POST /api/memories
export const addMemory = async (data) => {
  const response = await api.post('/memories', data);
  return response.data;
};

export default api;
