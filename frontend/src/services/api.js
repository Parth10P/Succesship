// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
