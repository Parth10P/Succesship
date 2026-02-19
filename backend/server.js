const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const memoryRoutes = require("./routes/memoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const decisionRoutes = require("./routes/decisionRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/memories", memoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/decision", decisionRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
