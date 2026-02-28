// frontend/src/components/DecisionPanel.jsx
import React from "react";

const DECISION_STYLES = {
  APPROVE: { backgroundColor: "#2e7d32", color: "#fff" },
  HOLD: { backgroundColor: "#f57f17", color: "#fff" },
  REJECT: { backgroundColor: "#c62828", color: "#fff" },
};

const DecisionPanel = ({ decision }) => {
  const styles = DECISION_STYLES[decision] || {
    backgroundColor: "#666",
    color: "#fff",
  };

  return (
    <div
      style={{
        ...styles,
        padding: "28px 20px",
        borderRadius: "8px",
        textAlign: "center",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          opacity: 0.8,
          marginBottom: "8px",
        }}
      >
        Decision
      </div>
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          letterSpacing: "2px",
        }}
      >
        {decision}
      </div>
    </div>
  );
};

export default DecisionPanel;
