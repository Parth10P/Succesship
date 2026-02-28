// frontend/src/services/api.js
import axios from "axios";

// Use Vite environment variable VITE_API_BASE_URL when available.
// Falls back to http://localhost:3000 for local development.
const baseURL = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
});

// POST /api/decision — submit invoice for AI decision
export const submitDecision = async (data) => {
  const response = await api.post("/api/decision", data);
  return response.data;
};

// POST /api/memories — add a new memory
export const addMemory = async (data) => {
  const response = await api.post("/api/memories", data);
  return response.data;
};

// GET /api/memories/:supplierId — get memories for a supplier
export const getMemories = async (supplierId) => {
  const response = await api.get(`/api/memories/${supplierId}`);
  return response.data;
};

// GET /api/suppliers — list all suppliers
export const getSuppliers = async () => {
  const response = await api.get("/api/suppliers");
  return response.data;
};

export default api;
