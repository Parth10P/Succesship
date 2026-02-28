// frontend/src/components/MemoryPanel.jsx
import React from "react";

const TYPE_COLORS = {
  quality: "#c62828",
  payment: "#e65100",
  logistics: "#1565c0",
  seasonal: "#2e7d32",
};

const STATE_COLORS = {
  active: "#333",
  stale: "#999",
  archived: "#ccc",
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays < 730) return "1 year ago";
  return `${Math.floor(diffDays / 365)} years ago`;
};

const MemoryPanel = ({ memories }) => {
  if (!memories || memories.length === 0) {
    return (
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Historical Memories</h3>
        <p style={{ color: "#999", fontStyle: "italic" }}>
          No historical memories were found for this supplier.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Memories Used ({memories.length})</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {memories.map((memory, index) => {
          const typeColor = TYPE_COLORS[memory.type] || "#666";
          const stateColor = STATE_COLORS[memory.lifecycleState] || "#999";
          const score = memory.relevanceScore ?? 0;

          return (
            <div
              key={memory.id || index}
              style={{
                padding: "12px",
                borderLeft: `4px solid ${typeColor}`,
                backgroundColor: "#fafafa",
                borderRadius: "0 6px 6px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span
                    style={{
                      padding: "2px 8px",
                      backgroundColor: typeColor,
                      color: "#fff",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {memory.type}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: stateColor,
                      fontStyle: "italic",
                    }}
                  >
                    {memory.lifecycleState}
                  </span>
                  {memory.isEvergreen && (
                    <span
                      style={{
                        padding: "2px 6px",
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        border: "1px solid #a5d6a7",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      🌱 EVERGREEN
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {timeAgo(memory.createdAt)}
                </span>
              </div>

              {/* Relevance bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  {score.toFixed(2)}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "6px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "3px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(score * 100, 100)}%`,
                      height: "100%",
                      backgroundColor: typeColor,
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#333",
                  lineHeight: "1.5",
                  fontSize: "14px",
                }}
              >
                {memory.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryPanel;
