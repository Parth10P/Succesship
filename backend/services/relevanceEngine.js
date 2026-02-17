/**
 * Relevance Engine
 *
 * Scores a memory based on its importance and time decay.
 * Formula: finalScore = importanceScore × getDecayWeight(createdAt)
 */
const { getDecayWeight } = require("../utils/timeDecay");

/**
 * Calculate the final relevance score for a memory.
 *
 * @param {Object} memory - Memory object with importanceScore and createdAt
 * @returns {number} Final relevance score (0–1)
 */
const score = (memory) => {
  const decayWeight = getDecayWeight(memory.createdAt);
  const finalScore = memory.importanceScore * decayWeight;
  return Math.round(finalScore * 100) / 100;
};

module.exports = { score };
