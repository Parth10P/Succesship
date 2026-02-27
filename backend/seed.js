// backend/seed.js
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

const days = (n) => n * 24 * 60 * 60 * 1000;

const seedDB = async () => {
  try {
    console.log("Connected to MongoDB via Prisma...");

    // Clear existing data (order matters for relations)
    await prisma.memory.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.supplier.deleteMany({});
    console.log("Cleared existing data.");

    // --- Create Suppliers ---
    const supplierXYZ = await prisma.supplier.create({
      data: {
        name: "Supplier XYZ",
        category: "raw materials",
        location: "Mumbai",
      },
    });
    console.log("Created:", supplierXYZ.name, supplierXYZ.id);

    const supplierABC = await prisma.supplier.create({
      data: {
        name: "Supplier ABC",
        category: "logistics",
        location: "Delhi",
      },
    });
    console.log("Created:", supplierABC.name, supplierABC.id);

    const now = Date.now();

    // --- Memories for Supplier XYZ ---
    const xyzMemories = [
      {
        supplierId: supplierXYZ.id,
        type: "quality",
        content:
          "Batch #442 had 30% defect rate — ₹50,000 in replacement costs. Quality inspection failed.",
        importanceScore: 0.9,
        createdAt: new Date(now - days(120)), // 4 months ago — bad
      },
      {
        supplierId: supplierXYZ.id,
        type: "payment",
        content:
          "Disputed invoice amount of ₹1,20,000. Took 3 weeks to resolve. Required escalation to management.",
        importanceScore: 0.7,
        createdAt: new Date(now - days(240)), // 8 months ago
      },
      {
        supplierId: supplierXYZ.id,
        type: "logistics",
        content:
          "Delivery delayed by 8 days due to warehouse flooding in transit hub.",
        importanceScore: 0.6,
        createdAt: new Date(now - days(60)), // 2 months ago
      },
      {
        supplierId: supplierXYZ.id,
        type: "seasonal",
        content:
          "Monsoon season causes consistent 5-7 day delays from this supplier every July-September.",
        importanceScore: 0.4,
        createdAt: new Date(now - days(395)), // 13 months ago — will be archived
      },
      {
        supplierId: supplierXYZ.id,
        type: "quality",
        content:
          "Latest 3 deliveries all passed inspection with zero defects. ISO 9001 certification renewed.",
        importanceScore: 0.8,
        isEvergreen: true, // This memory will never decay
        createdAt: new Date(now - days(21)), // 3 weeks ago — recent good (conflicts with bad)
      },
    ];

    // --- Memories for Supplier ABC ---
    const abcMemories = [
      {
        supplierId: supplierABC.id,
        type: "payment",
        content:
          "Clean payment history. All invoices settled within net-15 terms. No disputes.",
        importanceScore: 0.85,
        createdAt: new Date(now - days(30)), // 1 month ago
      },
      {
        supplierId: supplierABC.id,
        type: "logistics",
        content:
          "Two shipments arrived damaged due to poor packaging. ₹15,000 loss.",
        importanceScore: 0.5,
        createdAt: new Date(now - days(180)), // 6 months ago
      },
      {
        supplierId: supplierABC.id,
        type: "quality",
        content:
          "Raw material quality dropped below acceptable threshold in batch #221.",
        importanceScore: 0.6,
        createdAt: new Date(now - days(330)), // 11 months ago
      },
      {
        supplierId: supplierABC.id,
        type: "seasonal",
        content:
          "Holiday season 2023 caused 2-week production shutdown. No deliveries in December.",
        importanceScore: 0.3,
        createdAt: new Date(now - days(730)), // 2 years ago — will be archived
      },
    ];

    const allMemories = [...xyzMemories, ...abcMemories];
    for (const mem of allMemories) {
      const created = await prisma.memory.create({ data: mem });
      console.log(
        `  Memory [${created.type}] for supplier ${mem.supplierId === supplierXYZ.id ? "XYZ" : "ABC"}: "${created.content.substring(0, 50)}..."`
      );
    }

    console.log(`\nSeeded 2 suppliers and ${allMemories.length} memories.`);
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedDB();
