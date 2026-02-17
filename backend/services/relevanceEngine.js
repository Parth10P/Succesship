/**
 * Relevance Scoring Engine
 *
 * Computes a final relevance score for each memory.
 *
 * Formula:
 *   finalScore = importanceScore × decayWeight × typeMultiplier
 *   typeMultiplier: quality/payment = 1.1, others = 1.0
 */
const { getDecayWeight } = require("../utils/timeDecay");

// Type-based multipliers — quality and payment memories get a boost
const TYPE_MULTIPLIERS = {
  quality: 1.1,
  payment: 1.1,
  logistics: 1.0,
  seasonal: 1.0,
  general: 1.0,
};

/**
 * Calculate the final relevance score for a memory.
 *
 * @param {Object} memory - Memory object with importanceScore, createdAt, type
 * @returns {number} Final relevance score
 */
const score = (memory) => {
  const decayWeight = getDecayWeight(memory.createdAt);
  const typeMultiplier = TYPE_MULTIPLIERS[memory.type] || 1.0;
  const finalScore = memory.importanceScore * decayWeight * typeMultiplier;
  return Math.round(finalScore * 100) / 100;
};

module.exports = { score, TYPE_MULTIPLIERS };
