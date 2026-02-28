// frontend/src/App.jsx
import React, { useState } from "react";
import "./App.css";
import InvoiceForm from "./components/InvoiceForm";
import DecisionPanel from "./components/DecisionPanel";
import ExplanationPanel from "./components/ExplanationPanel";
import MemoryPanel from "./components/MemoryPanel";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResult = (data) => {
    setResult(data);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MemoraSearch</h1>
        <p>Business Memory &amp; Decision System</p>
      </header>

      <InvoiceForm
        onResult={handleResult}
        loading={loading}
        setLoading={setLoading}
      />

      {result && (
        <>
          <div className="divider" />

          <button className="reset-btn" onClick={handleReset}>
            ↺ Reset &amp; Submit Another
          </button>

          <DecisionPanel decision={result.decision} />
          <ExplanationPanel explanation={result.explanation} />
          <MemoryPanel memories={result.memoriesUsed} />
        </>
      )}
    </div>
  );
}

export default App;