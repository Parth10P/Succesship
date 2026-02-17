/**
 * Memory Lifecycle Manager
 *
 * Auto-transitions memory states based on age:
 *   - active → stale   (if age > 90 days)
 *   - stale → archived (if age > 365 days)
 */
const prisma = require("../config/db");
const { THRESHOLDS } = require("../utils/timeDecay");

/**
 * Update lifecycle states for all memories based on their age.
 *
 * | Current State | Age         | New State |
 * |---------------|-------------|-----------|
 * | active        | > 90 days   | stale     |
 * | any           | > 365 days  | archived  |
 */
const updateLifecycleStates = async () => {
  const now = new Date();
  const staleThreshold = new Date(
    now - THRESHOLDS.RECENT * 24 * 60 * 60 * 1000,
  ); // 90 days
  const archiveThreshold = new Date(now - THRESHOLDS.OLD * 24 * 60 * 60 * 1000); // 365 days

  // Archive memories older than 365 days
  const archived = await prisma.memory.updateMany({
    where: {
      createdAt: { lt: archiveThreshold },
      lifecycleState: { not: "archived" },
    },
    data: { lifecycleState: "archived" },
  });

  // Mark memories older than 90 days as stale (if still active)
  const staled = await prisma.memory.updateMany({
    where: {
      createdAt: { lt: staleThreshold },
      lifecycleState: "active",
    },
    data: { lifecycleState: "stale" },
  });

  if (archived.count > 0 || staled.count > 0) {
    console.log(
      `Lifecycle update: ${staled.count} → stale, ${archived.count} → archived`,
    );
  }
};

module.exports = { updateLifecycleStates };
