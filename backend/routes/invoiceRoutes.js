// backend/routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const { getInvoices } = require("../controllers/invoiceController");

// GET /api/invoices — get all past invoices
router.get("/", getInvoices);

module.exports = router;
