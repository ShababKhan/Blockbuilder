import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoadWorkflowModal = ({ isOpen, onClose, onLoadWorkflow }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchWorkflows();
    }
  }, [isOpen]);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/workflows');
      setWorkflows(response.data.workflows);
    } catch (err) {
      setError('Failed to load workflows');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (name) => {
    try {
      const response = await axios.get(`http://localhost:8000/load-workflow/${name}`);
      onLoadWorkflow(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to load workflow details', err);
      alert('Failed to load workflow');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '600px' }}>
        <div className="modal-header">
          <h2>Open Workflow</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '4px' }}>
          {loading && <p style={{ color: '#64748b' }}>Loading...</p>}
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}
          
          {!loading && !error && workflows.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No saved workflows found.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workflows.map((name) => (
              <div key={name} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                transition: 'background-color 0.2s'
              }}>
                <span style={{ fontWeight: '500', color: '#0f172a' }}>{name}</span>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleLoad(name)}
                  style={{ padding: '6px 12px', fontSize: '14px' }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LoadWorkflowModal;
