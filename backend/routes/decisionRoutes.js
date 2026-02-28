// backend/routes/decisionRoutes.js
const express = require("express");
const router = express.Router();
const { makeDecision } = require("../controllers/decisionController");

// POST /api/decision — request an AI decision for an invoice
router.post("/", makeDecision);

module.exports = router;
