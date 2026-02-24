```javascript
import React, { useState } from 'react';
import './App.css';
import InvoiceForm from './components/InvoiceForm';
import DecisionPanel from './components/DecisionPanel';
import ExplanationPanel from './components/ExplanationPanel';
import MemoryPanel from './components/MemoryPanel';

function App() {
  const [decisionResult, setDecisionResult] = useState(null);

  const handleDecision = (result) => {
    setDecisionResult(result);
  };

  const resetForm = () => {
    setDecisionResult(null);
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header className="App-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Succeship - Invoice Decision Engine</h1>
        <p>Submit an invoice for AI-powered evaluation against historical supplier memories.</p>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        {!decisionResult ? (
            <section style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
              <InvoiceForm onDecision={handleDecision} />
            </section>
        ) : (
            <section style={{ flex: '1', minWidth: '300px', width: '100%' }}>
              <button 
                onClick={resetForm}
                style={{
                  marginBottom: '20px',
                  padding: '10px 15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ← Submit Another Invoice
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <DecisionPanel 
                    decision={decisionResult.decision} 
                    conflictFlag={decisionResult.conflictFlag} 
                  />
                  <ExplanationPanel 
                    explanation={decisionResult.explanation} 
                  />
                </div>
                
                <div>
                  <MemoryPanel 
                    memories={decisionResult.memoriesUsed} 
                  />
                </div>
              </div>
            </section>
        )}
      </main>
    </div>
  );
}

export default App;
```
