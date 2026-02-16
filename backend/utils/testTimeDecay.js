/**
 * Quick test for timeDecay utility.
 * Run: node utils/testTimeDecay.js
 */
const { getDecayWeight, THRESHOLDS, WEIGHTS } = require("./timeDecay");

const testDates = [
  {
    label: "10 days ago",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    expected: 1.0,
  },
  {
    label: "60 days ago",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expected: 0.75,
  },
  {
    label: "120 days ago",
    date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    expected: 0.45,
  },
  {
    label: "250 days ago",
    date: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
    expected: 0.2,
  },
  {
    label: "400 days ago",
    date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    expected: 0.05,
  },
];

console.log("Time Decay Test Results:");
console.log("========================");
testDates.forEach(({ label, date, expected }) => {
  const weight = getDecayWeight(date);
  const pass = weight === expected ? "✓" : "✗";
  console.log(
    `${pass} ${label.padEnd(15)} → weight: ${weight}  (expected: ${expected})`,
  );
});

console.log("\nThresholds:", THRESHOLDS);
console.log("Weights:", WEIGHTS);
