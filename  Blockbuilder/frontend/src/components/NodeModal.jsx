import React, { useState, useEffect } from 'react';

const NodeModal = ({ isOpen, onClose, nodeData, onSave, onRun, onDelete }) => {
  const [activeTab, setActiveTab] = useState('naturalLanguage');
  const [formData, setFormData] = useState({
    label: '',
    naturalLanguage: '',
    pseudocode: '',
    pythonScript: ''
  });

  useEffect(() => {
    if (nodeData) {
      setFormData({
        label: nodeData.label || 'New Node',
        naturalLanguage: nodeData.config?.naturalLanguage || '',
        pseudocode: nodeData.config?.pseudocode || '',
        pythonScript: nodeData.config?.pythonScript || 'def run(input_path, output_path):\n    # Write your code here\n    pass'
      });
    }
  }, [nodeData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <input 
            type="text" 
            value={formData.label} 
            onChange={(e) => handleChange('label', e.target.value)}
            style={{ fontSize: '24px', fontWeight: 'bold', border: 'none', outline: 'none', width: '100%' }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'naturalLanguage' ? 'active' : ''}`}
            onClick={() => setActiveTab('naturalLanguage')}
          >
            1. Describe
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pseudocode' ? 'active' : ''}`}
            onClick={() => setActiveTab('pseudocode')}
          >
            2. Logic
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pythonScript' ? 'active' : ''}`}
            onClick={() => setActiveTab('pythonScript')}
          >
            3. Code
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'naturalLanguage' && (
            <textarea 
              placeholder="Describe what this node does in plain English..."
              value={formData.naturalLanguage}
              onChange={(e) => handleChange('naturalLanguage', e.target.value)}
            />
          )}
          {activeTab === 'pseudocode' && (
            <textarea 
              placeholder="Step 1: Do this..."
              value={formData.pseudocode}
              onChange={(e) => handleChange('pseudocode', e.target.value)}
            />
          )}
          {activeTab === 'pythonScript' && (
            <textarea 
              style={{ fontFamily: 'monospace', backgroundColor: '#FAFAFA' }}
              value={formData.pythonScript}
              onChange={(e) => handleChange('pythonScript', e.target.value)}
            />
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn" 
            style={{ backgroundColor: '#FFAB91', color: '#BF360C', marginRight: 'auto' }}
            onClick={onDelete}
          >
            Delete Node
          </button>
          <button className="btn btn-secondary" onClick={onRun}>Run Node</button>
          <button className="btn btn-primary" onClick={handleSave}>Save & Close</button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
