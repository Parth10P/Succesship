// backend/services/lifecycleManager.js
const prisma = require("../config/prismaClient");

/**
 * Update lifecycle states for all memories of a supplier based on age.
 *
 * | Age           | State    |
 * |---------------|----------|
 * | < 90 days     | active   |
 * | 90–365 days   | stale    |
 * | > 365 days    | archived |
 *
 * @param {string} supplierId
 */
const updateLifecycleStates = async (supplierId) => {
  const memories = await prisma.memory.findMany({
    where: { supplierId },
  });

  const now = new Date();

  for (const memory of memories) {
    if (memory.isEvergreen) continue; // Evergreen memories never decay

    const ageInDays = (now - new Date(memory.createdAt)) / (1000 * 60 * 60 * 24);

    let newState;
    if (ageInDays > 365) {
      newState = "archived";
    } else if (ageInDays >= 90) {
      newState = "stale";
    } else {
      newState = "active";
    }

    if (newState !== memory.lifecycleState) {
      await prisma.memory.update({
        where: { id: memory.id },
        data: { lifecycleState: newState },
      });
    }
  }
};

module.exports = { updateLifecycleStates };
