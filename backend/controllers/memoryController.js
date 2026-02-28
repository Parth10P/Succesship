// backend/controllers/memoryController.js
const prisma = require("../config/prismaClient");

const VALID_TYPES = ["quality", "payment", "logistics", "seasonal"];

/**
 * POST /api/memories — create a new memory for a supplier.
 */
const addMemory = async (req, res) => {
  try {
    const { supplierId, type, content, importanceScore } = req.body;

    if (!supplierId || !type || !content) {
      return res
        .status(400)
        .json({ error: "supplierId, type, and content are required." });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`,
      });
    }

    const memory = await prisma.memory.create({
      data: {
        supplierId,
        type,
        content,
        importanceScore: importanceScore ?? 0.5,
      },
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error("Error creating memory:", error);
    res.status(500).json({ error: "Failed to create memory." });
  }
};

/**
 * GET /api/memories/:supplierId — get all non-archived memories for a supplier.
 */
const getMemories = async (req, res) => {
  try {
    const { supplierId } = req.params;

    const memories = await prisma.memory.findMany({
      where: {
        supplierId,
        lifecycleState: { not: "archived" },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(memories);
  } catch (error) {
    console.error("Error fetching memories:", error);
    res.status(500).json({ error: "Failed to fetch memories." });
  }
};

/**
 * GET /api/suppliers — list all suppliers.
 */
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });
    res.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers." });
  }
};

module.exports = { addMemory, getMemories, getSuppliers };
