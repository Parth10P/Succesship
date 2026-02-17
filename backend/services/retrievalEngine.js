/**
 * Memory Retrieval Engine
 *
 * Fetches and ranks relevant memories for a supplier
 * when an invoice is being processed.
 */
const prisma = require("../config/db");
const relevanceEngine = require("./relevanceEngine");
const { updateLifecycleStates } = require("./lifecycleManager");

/**
 * Get top memories for a supplier, scored and sorted by relevance.
 *
 * - Runs lifecycle updates automatically before retrieval
 * - Excludes archived memories
 * - Scores each memory via relevanceEngine
 * - Returns top 5 sorted by finalScore (descending)
 * - Sets conflictFlag if both positive and negative signals exist (score gap > 0.4)
 *
 * @param {string} supplierId - The supplier's ObjectId
 * @returns {Object} { memories: [...top5], conflictFlag: boolean }
 */
const getMemoriesForSupplier = async (supplierId) => {
  // Auto-run lifecycle state transitions
  await updateLifecycleStates();

  // Fetch non-archived memories for this supplier
  const rawMemories = await prisma.memory.findMany({
    where: {
      supplierId,
      lifecycleState: { not: "archived" },
    },
    orderBy: { createdAt: "desc" },
  });

  // Score each memory
  const scoredMemories = rawMemories.map((memory) => ({
    ...memory,
    finalScore: relevanceEngine.score(memory),
  }));

  // Sort by finalScore descending
  scoredMemories.sort((a, b) => b.finalScore - a.finalScore);

  // Top 5 only — prevent information overload
  const top5 = scoredMemories.slice(0, 5);

  // Conflict detection: both recent positive AND negative signals (score gap > 0.4)
  const scores = top5.map((m) => m.finalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const conflictFlag = scores.length >= 2 && maxScore - minScore > 0.4;

  return {
    memories: top5,
    conflictFlag,
  };
};

module.exports = { getMemoriesForSupplier };
