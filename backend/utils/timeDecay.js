/**
 * Time Decay Utility
 *
 * Calculates how much weight an old memory should carry.
 * Recent memories count more; old memories fade.
 *
 * Formula (used by relevanceEngine):
 *   finalScore = memory.importanceScore × getDecayWeight(memory.createdAt)
 */

// Named thresholds (in days) — reusable by lifecycleManager
const THRESHOLDS = {
  FRESH: 30, // 0–30 days
  RECENT: 90, // 31–90 days
  MODERATE: 180, // 91–180 days
  OLD: 365, // 181–365 days
};

// Decay weights per bracket
const WEIGHTS = {
  FRESH: 1.0, // Fully fresh
  RECENT: 0.75,
  MODERATE: 0.45,
  OLD: 0.2,
  ARCHIVED: 0.05, // Nearly irrelevant
};

/**
 * Calculate decay weight based on memory age.
 *
 * | Memory Age        | Weight |
 * |-------------------|--------|
 * | 0–30 days         | 1.00   |
 * | 31–90 days        | 0.75   |
 * | 91–180 days       | 0.45   |
 * | 181–365 days      | 0.20   |
 * | > 365 days        | 0.05   |
 *
 * @param {Date|string} createdAt - The creation date of the memory
 * @returns {number} Decay weight between 0.05 and 1.0
 */
const getDecayWeight = (createdAt) => {
  const now = new Date();
  const ageInDays = (now - new Date(createdAt)) / (1000 * 60 * 60 * 24);

  if (ageInDays <= THRESHOLDS.FRESH) return WEIGHTS.FRESH;
  if (ageInDays <= THRESHOLDS.RECENT) return WEIGHTS.RECENT;
  if (ageInDays <= THRESHOLDS.MODERATE) return WEIGHTS.MODERATE;
  if (ageInDays <= THRESHOLDS.OLD) return WEIGHTS.OLD;
  return WEIGHTS.ARCHIVED;
};

module.exports = { getDecayWeight, THRESHOLDS, WEIGHTS };
