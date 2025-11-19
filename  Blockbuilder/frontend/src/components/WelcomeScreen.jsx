import React from 'react';

const WelcomeScreen = ({ onCreateNew, onLoadExample }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#F0F4F8',
      color: '#37474F',
      fontFamily: "'Nunito', sans-serif"
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Workflow Builder</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#546E7A' }}>
        Visually build and execute Python workflows.
      </p>

      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={onCreateNew}
          style={{
            padding: '20px 40px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: '#4FC3F7',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 6px 0 #0288D1',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(4px)';
            e.currentTarget.style.boxShadow = '0 2px 0 #0288D1';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 0 #0288D1';
          }}
        >
          ✨ Create New Canvas
        </button>

        <button 
          onClick={onLoadExample}
          style={{
            padding: '20px 40px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '16px',
            border: '2px solid #CFD8DC',
            backgroundColor: 'white',
            color: '#546E7A',
            cursor: 'pointer',
            boxShadow: '0 6px 0 #B0BEC5',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(4px)';
            e.currentTarget.style.boxShadow = '0 2px 0 #B0BEC5';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 0 #B0BEC5';
          }}
        >
          📂 Load Example
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
