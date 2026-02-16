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

    // --- Supplier 1: XYZ Raw Materials ---
    const supplier1 = await prisma.supplier.create({
      data: {
        name: "XYZ Raw Materials Ltd.",
        category: "raw_materials",
        location: "Mumbai, India",
        contactEmail: "procurement@xyzraw.com",
      },
    });

    // --- Supplier 2: ABC Packaging ---
    const supplier2 = await prisma.supplier.create({
      data: {
        name: "ABC Packaging Co.",
        category: "packaging",
        location: "Pune, India",
        contactEmail: "sales@abcpack.com",
      },
    });

    console.log("Seeded 2 suppliers.");

    // --- Memories for Supplier 1 (XYZ) — mixed history ---
    const xyzMemories = [
      {
        supplierId: supplier1.id,
        type: "quality",
        content:
          "Delivered 30% broken products — ₹50,000 in replacement costs.",
        importanceScore: 0.9,
        lifecycleState: "active",
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
      },
      {
        supplierId: supplier1.id,
        type: "payment",
        content: "Disputed invoice claiming non-receipt of goods.",
        importanceScore: 0.6,
        lifecycleState: "stale",
        createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // 8 months ago
      },
      {
        supplierId: supplier1.id,
        type: "logistics",
        content: "Consistent on-time delivery for the last 3 months.",
        importanceScore: 0.7,
        lifecycleState: "active",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      },
      {
        supplierId: supplier1.id,
        type: "quality",
        content: "Excellent batch quality on last order — zero defects.",
        importanceScore: 0.8,
        lifecycleState: "active",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        supplierId: supplier1.id,
        type: "general",
        content: "Reliable communication — responds within 24 hours.",
        importanceScore: 0.4,
        lifecycleState: "active",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      },
    ];

    // --- Memories for Supplier 2 (ABC) — mostly good ---
    const abcMemories = [
      {
        supplierId: supplier2.id,
        type: "quality",
        content:
          "Packaging quality has been excellent — zero defects in last 6 deliveries.",
        importanceScore: 0.8,
        lifecycleState: "active",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        supplierId: supplier2.id,
        type: "payment",
        content: "Always pays on time. No disputes ever recorded.",
        importanceScore: 0.5,
        lifecycleState: "active",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      },
      {
        supplierId: supplier2.id,
        type: "logistics",
        content: "Three late deliveries last year during monsoon season.",
        importanceScore: 0.7,
        lifecycleState: "stale",
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // ~7 months ago
      },
      {
        supplierId: supplier2.id,
        type: "seasonal",
        content:
          "Warehouse floods during monsoon — expect delays July to September.",
        importanceScore: 0.65,
        lifecycleState: "stale",
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      },
    ];

    // Insert all memories
    for (const mem of [...xyzMemories, ...abcMemories]) {
      await prisma.memory.create({ data: mem });
    }

    console.log(`Seeded ${xyzMemories.length + abcMemories.length} memories.`);
    console.log("\nSeeding complete!");
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedDB();
