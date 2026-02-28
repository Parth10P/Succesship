// frontend/src/components/InvoiceForm.jsx
import React, { useState, useEffect } from "react";
import { submitDecision, getSuppliers } from "../services/api";

const InvoiceForm = ({ onResult, loading, setLoading }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    supplierId: "",
    invoiceAmount: "",
    invoiceDate: "",
    description: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.error("Failed to load suppliers:", err);
        setError("Could not load suppliers. Is the backend running?");
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.supplierId ||
      !formData.invoiceAmount ||
      !formData.invoiceDate ||
      !formData.description
    ) {
      setError("All fields are required.");
      return;
    }

    if (Number(formData.invoiceAmount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        invoiceAmount: Number(formData.invoiceAmount),
      };
      const result = await submitDecision(payload);
      onResult(result);
    } catch (err) {
      console.error("Decision error:", err);
      const msg =
        err.response?.data?.error ||
        "Failed to get a decision. Check the backend and Groq configuration.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Submit Invoice</h2>
      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-group">
          <label htmlFor="supplierId">Supplier</label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
          >
            <option value="">-- Select a Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.location || s.category || "N/A"})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="invoiceAmount">Amount (₹)</label>
          <input
            type="number"
            id="invoiceAmount"
            name="invoiceAmount"
            value={formData.invoiceAmount}
            onChange={handleChange}
            min="1"
            placeholder="e.g. 250000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="invoiceDate">Invoice Date</label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. Monthly supply of raw materials batch #442"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Submit Invoice"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
