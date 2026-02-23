import React, { useState, useEffect } from 'react';
import { getSuppliers, submitInvoice } from '../services/api';

const InvoiceForm = ({ onDecision }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    supplierId: '',
    amount: '',
    description: '',
    date: ''
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.error('Failed to fetch suppliers:', err);
        setError('Could not load suppliers. Is the backend running?');
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.supplierId || !formData.amount || !formData.description || !formData.date) {
      setError('All fields are required.');
      return false;
    }
    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    onDecision(null); // Clear previous results

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount) // Ensure amount is processed as a number
      };

      const response = await submitInvoice(payload);
      onDecision(response);

      // Optional: Clear form on success
      setFormData({
        supplierId: '',
        amount: '',
        description: '',
        date: ''
      });
    } catch (err) {
      console.error('Failed to submit invoice:', err);
      // Give a user-friendly error message
      const errMsg = err.response?.data?.error || 'Failed to get an AI decision. Please check the backend connection and Groq configuration.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-form-container" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Submit New Invoice</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div>
          <label htmlFor="supplierId" style={{ display: 'block', marginBottom: '5px' }}>Supplier</label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">-- Select a Supplier --</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Raw materials batch #442"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Invoice Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            backgroundColor: loading ? '#999' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing through AI Engine...' : 'Submit Invoice'}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
