import React from 'react';

const WelcomeScreen = ({ onCreateNew, onLoadExample }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'Inter', sans-serif"
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.025em' }}>Workflow Builder</h1>
      <p style={{ fontSize: '1.125rem', marginBottom: '48px', color: '#64748b' }}>
        Visually build and execute Python workflows.
      </p>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={onCreateNew}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '500',
            borderRadius: '6px',
            border: '1px solid transparent',
            backgroundColor: '#0f172a',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
        >
          Create New Canvas
        </button>

        <button 
          onClick={onLoadExample}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '500',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: 'white',
            color: '#475569',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          Load Example
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
