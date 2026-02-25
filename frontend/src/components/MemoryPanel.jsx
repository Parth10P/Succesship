import React from 'react';

const MemoryPanel = ({ memories }) => {
  if (!memories || memories.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fdfdfd', border: '1px solid #eee', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>Historical Context</h3>
        <p style={{ margin: 0, color: '#aaa', fontStyle: 'italic' }}>No historical memories found for this supplier.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#495057' }}>Memories Used for Context</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {memories.map((memory, index) => {
          const isStale = memory.lifecycleState === 'stale';
          const score = typeof memory.finalScore === 'number' ? memory.finalScore : memory.importanceScore;

          return (
            <div
              key={memory.id || index}
              style={{
                padding: '12px',
                borderLeft: `4px solid ${isStale ? '#ced4da' : '#007bff'}`,
                backgroundColor: isStale ? '#f8f9fa' : '#ffffff',
                opacity: isStale ? 0.7 : 1,
                borderRadius: '0 4px 4px 0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '3px 8px',
                    backgroundColor: isStale ? '#e9ecef' : '#e7f1ff',
                    color: isStale ? '#6c757d' : '#004085',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {memory.type}
                  </span>

                  {isStale && (
                    <span style={{ fontSize: '12px', color: '#868e96', fontStyle: 'italic' }}>
                      (Stale)
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '13px', color: '#6c757d', fontWeight: 'bold' }}>
                  Score: {score?.toFixed(2) || '0.00'}
                </div>
              </div>

              <p style={{ margin: 0, color: isStale ? '#6c757d' : '#212529', lineHeight: '1.5' }}>
                {memory.content}
              </p>
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default MemoryPanel;
