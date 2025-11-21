import React, { useState, useEffect } from 'react';

const NodeModal = ({ isOpen, onClose, nodeData, onSave, onRun, onDelete }) => {
  const [activeTab, setActiveTab] = useState('naturalLanguage');
  const [formData, setFormData] = useState({
    label: '',
    naturalLanguage: '',
    pseudocode: '',
    pythonScript: '',
    inputExample: '',
    outputExample: ''
  });

  const [newStepText, setNewStepText] = useState('');
  const [isBlockMode, setIsBlockMode] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    if (nodeData) {
      setFormData({
        label: nodeData.label || 'New Node',
        naturalLanguage: nodeData.config?.naturalLanguage || '',
        pseudocode: nodeData.config?.pseudocode || '',
        pythonScript: nodeData.config?.pythonScript || 'def run(input_path, output_path):\n    # Write your code here\n    pass',
        inputExample: nodeData.config?.inputExample || '',
        outputExample: nodeData.config?.outputExample || ''
      });
    }
  }, [nodeData]);

  // Sync codeBlocks when entering Block Mode
  useEffect(() => {
    if (isBlockMode) {
      const steps = formData.pseudocode ? formData.pseudocode.split('\n').filter(s => s.trim()) : [];
      const script = formData.pythonScript || '';
      
      // Try to parse existing blocks
      const blocks = [];
      // Simple regex to find blocks: # %% STEP <index>
      // If not found, we might just put everything in the first block or leave empty
      
      for (let i = 0; i < steps.length; i++) {
        const regex = new RegExp(`# %% STEP ${i}\\n([\\s\\S]*?)(?=# %% STEP|$)`);
        const match = script.match(regex);
        blocks.push(match ? match[1].trim() : '');
      }
      
      // If script exists but no blocks found, put it all in the first block (if exists)
      if (script.trim() && blocks.every(b => !b) && steps.length > 0) {
          blocks[0] = script;
      }

      setCodeBlocks(blocks);
    }
  }, [isBlockMode, formData.pseudocode]); // Re-run if mode changes or steps change

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    const currentSteps = formData.pseudocode ? formData.pseudocode.split('\n').filter(s => s.trim()) : [];
    const newSteps = [...currentSteps, newStepText.trim()];
    handleChange('pseudocode', newSteps.join('\n'));
    setNewStepText('');
  };

  const handleDeleteStep = (index) => {
    const currentSteps = formData.pseudocode ? formData.pseudocode.split('\n').filter(s => s.trim()) : [];
    const newSteps = currentSteps.filter((_, i) => i !== index);
    handleChange('pseudocode', newSteps.join('\n'));
  };

  const handleBlockCodeChange = (index, value) => {
    const newBlocks = [...codeBlocks];
    newBlocks[index] = value;
    setCodeBlocks(newBlocks);

    // Reconstruct full script
    const newScript = newBlocks.map((code, i) => `# %% STEP ${i}\n${code}`).join('\n\n');
    handleChange('pythonScript', newScript);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <input 
            type="text" 
            value={formData.label} 
            onChange={(e) => handleChange('label', e.target.value)}
            style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              border: 'none', 
              outline: 'none', 
              width: '100%',
              color: '#0f172a',
              fontFamily: 'inherit'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'naturalLanguage' ? 'active' : ''}`}
            onClick={() => setActiveTab('naturalLanguage')}
          >
            Describe
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pseudocode' ? 'active' : ''}`}
            onClick={() => setActiveTab('pseudocode')}
          >
            Logic
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pythonScript' ? 'active' : ''}`}
            onClick={() => setActiveTab('pythonScript')}
          >
            Code
          </button>
          <button 
            className={`tab-btn ${activeTab === 'io' ? 'active' : ''}`}
            onClick={() => setActiveTab('io')}
          >
            I/O
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
            <div style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px' }}>
                    {formData.pseudocode.split('\n').filter(s => s.trim()).map((step, index) => (
                        <div key={index} style={{
                            padding: '12px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            flexShrink: 0
                        }}>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#334155' }}>{index + 1}. {step}</span>
                            <button 
                                onClick={() => handleDeleteStep(index)}
                                style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
                                title="Remove step"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {(!formData.pseudocode || !formData.pseudocode.trim()) && (
                        <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px', fontStyle: 'italic' }}>
                            No logic steps yet. Add one below.
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <input 
                        type="text" 
                        value={newStepText}
                        onChange={(e) => setNewStepText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                        placeholder="Type a logic step..."
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px'
                        }}
                    />
                    <button 
                        onClick={handleAddStep}
                        className="btn btn-primary"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        Add Step
                    </button>
                </div>
            </div>
          )}
          {activeTab === 'pythonScript' && (
            <div style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}>
                        <input 
                            type="checkbox" 
                            checked={isBlockMode} 
                            onChange={(e) => setIsBlockMode(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                        />
                        Block Mode
                    </label>
                </div>
                
                {!isBlockMode ? (
                    <textarea 
                        style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace", backgroundColor: '#f8fafc', flex: 1 }}
                        value={formData.pythonScript}
                        onChange={(e) => handleChange('pythonScript', e.target.value)}
                    />
                ) : (
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
                        {formData.pseudocode.split('\n').filter(s => s.trim()).map((step, index) => (
                            <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{ 
                                    backgroundColor: '#f1f5f9', 
                                    padding: '8px 12px', 
                                    fontSize: '12px', 
                                    fontWeight: '600', 
                                    color: '#475569',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    Step {index + 1}: {step}
                                </div>
                                <textarea 
                                    style={{ 
                                        width: '100%', 
                                        height: '100px', 
                                        padding: '8px', 
                                        border: 'none', 
                                        fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace", 
                                        fontSize: '13px',
                                        resize: 'vertical',
                                        backgroundColor: '#fff'
                                    }}
                                    value={codeBlocks[index] || ''}
                                    onChange={(e) => handleBlockCodeChange(index, e.target.value)}
                                    placeholder={`# Code for: ${step}`}
                                />
                            </div>
                        ))}
                        {(!formData.pseudocode || !formData.pseudocode.trim()) && (
                            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>
                                No logic steps defined. Go to the Logic tab to add steps.
                            </div>
                        )}
                    </div>
                )}
            </div>
          )}
          {activeTab === 'io' && (
            <div style={{ display: 'flex', gap: '16px', height: '450px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '14px' }}>Expected Input Example</label>
                    <textarea 
                        style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace", resize: 'none', backgroundColor: '#f8fafc' }}
                        placeholder="e.g. CSV file with columns: id, name, age"
                        value={formData.inputExample}
                        onChange={(e) => handleChange('inputExample', e.target.value)}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '14px' }}>Expected Output Example</label>
                    <textarea 
                        style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace", resize: 'none', backgroundColor: '#f8fafc' }}
                        placeholder="e.g. JSON: { 'status': 'success', 'count': 50 }"
                        value={formData.outputExample}
                        onChange={(e) => handleChange('outputExample', e.target.value)}
                    />
                </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-danger" 
            style={{ marginRight: 'auto' }}
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
