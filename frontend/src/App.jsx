import React, { useState } from 'react';
import './App.css';
import InvoiceForm from './components/InvoiceForm';

function App() {
  const [decisionResult, setDecisionResult] = useState(null);

  const handleDecision = (result) => {
    setDecisionResult(result);
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'APPROVE': return '#28a745';
      case 'HOLD': return '#ffc107';
      case 'REJECT': return '#dc3545';
      default: return '#333';
    }
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header className="App-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Succeship - Invoice Decision Engine</h1>
        <p>Submit an invoice for AI-powered evaluation against historical supplier memories.</p>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        {/* Invoice Form Area */}
        <section style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
          <InvoiceForm onDecision={handleDecision} />
        </section>

        {/* Results Area */}
        <section style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
          <h2>AI Decision Result</h2>

          {!decisionResult ? (
            <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '8px', color: '#666' }}>
              Submit an invoice to see the AI's recommendation based on historical context.
            </div>
          ) : (
            <div style={{
              padding: '20px',
              border: `2px solid ${getDecisionColor(decisionResult.decision)}`,
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                color: getDecisionColor(decisionResult.decision),
                fontSize: '24px'
              }}>
                {decisionResult.decision}
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <strong>Explanation:</strong>
                <p style={{ margin: '5px 0 0 0', lineHeight: '1.5' }}>
                  {decisionResult.explanation}
                </p>
              </div>

              <div style={{ fontSize: '14px', color: '#555' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Memories Used for Context:</strong> {decisionResult.memoriesUsed}
                </p>
                {decisionResult.conflictFlag && (
                  <p style={{ margin: '5px 0', color: '#dc3545', fontWeight: 'bold' }}>
                    ⚠️ Warning: Conflicting historical signals detected that require human review.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
