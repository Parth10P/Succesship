import React from 'react';

const DecisionPanel = ({ decision, conflictFlag }) => {
  const getDecisionStyles = () => {
    switch (decision) {
      case 'APPROVE':
        return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
      case 'HOLD':
        return { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };
      case 'REJECT':
        return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' };
    }
  };

  const styles = getDecisionStyles();

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          ...styles,
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '32px', letterSpacing: '1px' }}>{decision}</h2>
      </div>

      {conflictFlag && (
        <div style={{
          marginTop: '10px',
          padding: '12px',
          backgroundColor: '#ff9800',
          color: 'white',
          borderRadius: '6px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span>Warning: Conflicting historical signals detected that require human review.</span>
        </div>
      )}
    </div>
  );
};

export default DecisionPanel;
