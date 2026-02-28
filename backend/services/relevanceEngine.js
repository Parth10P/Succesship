// backend/services/relevanceEngine.js
const { calculateTimeDecay } = require("../utils/timeDecay");

/**
 * Score memories by relevance and return the top 5.
 *
 * relevanceScore = importanceScore × timeDecayWeight
 *
 * @param {Array} memories - Array of Memory records from Prisma
 * @returns {Array} Top 5 memories with `relevanceScore` attached, sorted desc
 */
const scoreMemories = (memories) => {
  const scored = memories.map((memory) => {
    const decayWeight = calculateTimeDecay(memory.createdAt);
    const relevanceScore =
      Math.round(memory.importanceScore * decayWeight * 100) / 100;
    return { ...memory, relevanceScore };
  });

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scored.slice(0, 5);
};

module.exports = { scoreMemories };
