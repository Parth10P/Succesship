const express = require("express");
const router = express.Router();
const {
    getSuppliers,
    createSupplier,
} = require("../controllers/memoryController");

// GET /api/suppliers — list all suppliers
router.get("/", getSuppliers);

// POST /api/suppliers — create a new supplier
router.post("/", createSupplier);

module.exports = router;
