import React from 'react';

const ExplanationPanel = ({ explanation }) => {
  return (
    <div style={{
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#495057' }}>AI Explanation</h3>
      <p style={{ margin: 0, lineHeight: '1.6', color: '#212529', fontSize: '16px' }}>
        {explanation}
      </p>
    </div>
  );
};

export default ExplanationPanel;
