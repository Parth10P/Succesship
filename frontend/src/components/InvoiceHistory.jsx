// frontend/src/components/InvoiceHistory.jsx
import React, { useState, useEffect } from "react";
import { getInvoices } from "../services/api";

const STATUS_COLORS = {
  APPROVED: "#2e7d32",
  HELD: "#f57f17",
  REJECTED: "#c62828",
  REJECT: "#c62828",
  DISAPPROVED: "#c62828",
  PENDING: "#666",
};

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div
        style={{
          color: "#888",
          textAlign: "center",
          padding: "20px",
          fontSize: "14px",
        }}
      >
        Loading past decisions...
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        backgroundColor: "#111",
        color: "#eee",
        border: "1px solid #333",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          marginBottom: "20px",
          color: "#fff",
          borderBottom: "1px solid #333",
          paddingBottom: "10px",
        }}
      >
        Past Invoice
      </h2>

      {invoices.length === 0 ? (
        <p
          style={{
            color: "#888",
            fontSize: "14px",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No invoices submitted yet.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    color: "#888",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Supplier
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    color: "#888",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    color: "#888",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    color: "#888",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderTop: "1px solid #222" }}>
                  <td style={{ padding: "12px 8px", fontWeight: "500" }}>
                    {invoice.supplier?.name || "Unknown"}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    $
                    {invoice.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    {formatDate(invoice.date)}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span
                      style={{
                        backgroundColor:
                          STATUS_COLORS[invoice.status.toUpperCase()] ||
                          STATUS_COLORS.PENDING,
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        display: "inline-block",
                        minWidth: "70px",
                        textAlign: "center",
                      }}
                    >
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;
