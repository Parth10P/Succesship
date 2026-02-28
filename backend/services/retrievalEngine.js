// backend/services/retrievalEngine.js
const prisma = require("../config/prismaClient");

/**
 * Fetch all non-archived memories for a supplier, newest first.
 * @param {string} supplierId
 * @returns {Promise<Array>}
 */
const retrieveMemories = async (supplierId) => {
  const memories = await prisma.memory.findMany({
    where: {
      supplierId,
      lifecycleState: { not: "archived" },
    },
    orderBy: { createdAt: "desc" },
  });
  return memories;
};

module.exports = { retrieveMemories };
