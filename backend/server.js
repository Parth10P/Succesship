// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const prisma = require("./config/prismaClient");
const memoryRoutes = require("./routes/memoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const decisionRoutes = require("./routes/decisionRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

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
app.use("/api/invoices", invoiceRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB via Prisma.");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\nShutting down...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();
