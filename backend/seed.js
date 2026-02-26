const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

const seedDB = async () => {
  try {
    console.log("Connected to MongoDB via Prisma...");

    // Clear existing data
    await prisma.memory.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.supplier.deleteMany({});
    console.log("Cleared existing data.");

    // --- Supplier 1: Supplier A (APPROVE Scenario) ---
    const supplierA = await prisma.supplier.create({
      data: {
        name: "Supplier A",
        category: "general",
        location: "New York, USA",
        contactEmail: "contact@suppliera.com",
      },
    });

    // --- Supplier 2: Supplier B (HOLD Scenario) ---
    const supplierB = await prisma.supplier.create({
      data: {
        name: "Supplier B",
        category: "logistics",
        location: "London, UK",
        contactEmail: "logistics@supplierb.co.uk",
      },
    });

    // --- Supplier 3: Supplier C (REJECT Scenario) ---
    const supplierC = await prisma.supplier.create({
      data: {
        name: "Supplier C",
        category: "materials",
        location: "Shenzhen, CN",
        contactEmail: "sales@supplierc.cn",
      },
    });

    console.log("Seeded 3 suppliers.");

    const now = Date.now();
    const days = (n) => n * 24 * 60 * 60 * 1000;

    // --- Memories for Supplier A (APPROVE: All recent, positive memories) ---
    const supplierAMemories = [
      {
        supplierId: supplierA.id,
        type: "quality",
        content: "Outstanding quality in the last 3 deliveries. Zero defects.",
        importanceScore: 0.9,
        lifecycleState: "active",
        createdAt: new Date(now - days(10)), // 10 days ago
      },
      {
        supplierId: supplierA.id,
        type: "logistics",
        content: "Delivered 2 days ahead of schedule.",
        importanceScore: 0.8,
        lifecycleState: "active",
        createdAt: new Date(now - days(30)), // 1 month ago
      }
    ];

    // --- Memories for Supplier B (HOLD: Old bad, recent good -> conflict) ---
    const supplierBMemories = [
      {
        supplierId: supplierB.id,
        type: "logistics",
        content: "Consistent on-time delivery for the last 2 months.",
        importanceScore: 0.8,
        lifecycleState: "active",
        createdAt: new Date(now - days(15)), // 15 days ago (Recent Good)
      },
      {
        supplierId: supplierB.id,
        type: "payment",
        content: "Severe dispute over pricing terms resulting in delayed shipments.",
        importanceScore: 0.9, // High importance
        lifecycleState: "stale",
        createdAt: new Date(now - days(200)), // ~7 months ago (Old Bad)
      }
    ];

    // --- Memories for Supplier C (REJECT: Recent bad quality + payment dispute) ---
    const supplierCMemories = [
      {
        supplierId: supplierC.id,
        type: "quality",
        content: "Batch #889 rejected due to 40% failure rate below spec thresholds.",
        importanceScore: 0.95,
        lifecycleState: "active",
        createdAt: new Date(now - days(5)), // 5 days ago (Recent Bad Quality)
      },
      {
        supplierId: supplierC.id,
        type: "payment",
        content: "Refusing to accept net-30 terms and threatening to pause production.",
        importanceScore: 0.85,
        lifecycleState: "active",
        createdAt: new Date(now - days(12)), // 12 days ago (Recent Payment Dispute)
      }
    ];

    // Insert all memories
    const allMemories = [...supplierAMemories, ...supplierBMemories, ...supplierCMemories];
    for (const mem of allMemories) {
      await prisma.memory.create({ data: mem });
    }

    console.log(`Seeded ${allMemories.length} memories.`);
    console.log("\nSeeding complete!");
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedDB();
