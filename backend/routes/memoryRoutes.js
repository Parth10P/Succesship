// backend/routes/memoryRoutes.js
const express = require("express");
const router = express.Router();
const { addMemory, getMemories } = require("../controllers/memoryController");

// POST /api/memories — create a new memory
router.post("/", addMemory);

// GET /api/memories/:supplierId — get memories for a supplier
router.get("/:supplierId", getMemories);

module.exports = router;
