const express = require("express");
const router = express.Router();
const { processInvoice } = require("../controllers/decisionController");

// POST /api/decision — request an AI decision for an invoice
router.post("/", processInvoice);

module.exports = router;
