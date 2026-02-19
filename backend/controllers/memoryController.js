const prisma = require("../config/db");

// POST /api/memories — create a new memory for a supplier
const createMemory = async (req, res) => {
    try {
        const { supplierId, type, content, importanceScore } = req.body;

        // Validate required fields
        if (!supplierId || !content) {
            return res
                .status(400)
                .json({ error: "supplierId and content are required" });
        }

        // Verify the supplier exists
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
        });

        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        const memory = await prisma.memory.create({
            data: {
                supplierId,
                type: type || "general",
                content,
                importanceScore: importanceScore ?? 0.5,
            },
        });

        res.status(201).json(memory);
    } catch (error) {
        console.error("Error creating memory:", error);
        res.status(500).json({ error: "Failed to create memory" });
    }
};

// GET /api/memories/:supplierId — get all non-archived memories for a supplier
const getMemoriesBySupplier = async (req, res) => {
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
        res.status(500).json({ error: "Failed to fetch memories" });
    }
};

// GET /api/suppliers — list all suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: "asc" },
        });

        res.json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
};

// POST /api/suppliers — create a new supplier
const createSupplier = async (req, res) => {
    try {
        const { name, category, location } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }

        const supplier = await prisma.supplier.create({
            data: {
                name,
                category: category || "general",
                location: location || "",
            },
        });

        res.status(201).json(supplier);
    } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ error: "Failed to create supplier" });
    }
};

module.exports = {
    createMemory,
    getMemoriesBySupplier,
    getSuppliers,
    createSupplier,
};
