// backend/utils/timeDecay.js

/**
 * Calculate a decay weight based on memory age.
 *
 * | Memory Age        | Weight |
 * |-------------------|--------|
 * | 0–30 days         | 1.0    |
 * | 31–90 days        | 0.8    |
 * | 91–180 days       | 0.6    |
 * | 181–365 days      | 0.3    |
 * | > 365 days        | 0.1    |
 *
 * @param {Date|string} createdAt
 * @returns {number}
 */
const calculateTimeDecay = (createdAt) => {
  const now = new Date();
  const ageInDays = (now - new Date(createdAt)) / (1000 * 60 * 60 * 24);

  if (ageInDays <= 30) return 1.0;
  if (ageInDays <= 90) return 0.8;
  if (ageInDays <= 180) return 0.6;
  if (ageInDays <= 365) return 0.3;
  return 0.1;
};

module.exports = { calculateTimeDecay };
