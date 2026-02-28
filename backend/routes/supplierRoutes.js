// backend/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const { getSuppliers } = require("../controllers/memoryController");

// GET /api/suppliers — list all suppliers
router.get("/", getSuppliers);

module.exports = router;
