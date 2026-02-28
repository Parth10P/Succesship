// frontend/src/components/ExplanationPanel.jsx
import React from "react";

const ExplanationPanel = ({ explanation }) => {
  return (
    <div
      className="card"
      style={{
        borderLeft: "4px solid #1565c0",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#555", fontSize: "14px" }}>
        Why this decision was made
      </h3>
      <p
        style={{
          margin: 0,
          lineHeight: "1.7",
          color: "#333",
          fontSize: "15px",
        }}
      >
        {explanation}
      </p>
    </div>
  );
};

export default ExplanationPanel;
