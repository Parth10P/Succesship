const express = require("express");
const router = express.Router();
const {
    createMemory,
    getMemoriesBySupplier,
} = require("../controllers/memoryController");

// POST /api/memories — create a new memory
router.post("/", createMemory);

// GET /api/memories/:supplierId — get all non-archived memories for a supplier
router.get("/:supplierId", getMemoriesBySupplier);

module.exports = router;
