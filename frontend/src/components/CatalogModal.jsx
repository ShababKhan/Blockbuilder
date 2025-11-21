import React from 'react';

const templates = [
  {
    id: 't1',
    label: 'Load CSV',
    description: 'Reads a CSV file into a pandas DataFrame.',
    config: {
      naturalLanguage: 'Load a CSV file from the input path.',
      pseudocode: '1. Import pandas\n2. Read CSV from input_path\n3. Save to output_path',
      pythonScript: `import pandas as pd

def run(input_path, output_path):
    # In a real scenario, input_path might be the file to load
    # For this POC, we'll assume input_path points to a CSV
    df = pd.read_csv(input_path)
    df.to_csv(output_path, index=False)
    print(f"Loaded {len(df)} rows.")`
    }
  },
  {
    id: 't2',
    label: 'Filter Rows',
    description: 'Filters rows where a column matches a condition.',
    config: {
      naturalLanguage: 'Filter rows where "age" is greater than 30.',
      pseudocode: '1. Load data\n2. Filter df[df.age > 30]\n3. Save result',
      pythonScript: `import pandas as pd

def run(input_path, output_path):
    df = pd.read_csv(input_path)
    # Example filtering
    if 'age' in df.columns:
        filtered_df = df[df['age'] > 30]
        filtered_df.to_csv(output_path, index=False)
        print(f"Filtered to {len(filtered_df)} rows.")
    else:
        print("Column 'age' not found.")
        df.to_csv(output_path, index=False)`
    }
  },
  {
    id: 't3',
    label: 'Print Hello',
    description: 'A simple node that prints a message.',
    config: {
      naturalLanguage: 'Print "Hello World" to the logs.',
      pseudocode: '1. Print message',
      pythonScript: `def run(input_path, output_path):
    print("Hello World from the workflow!")
    # Just touch the output file to ensure flow continues
    with open(output_path, 'w') as f:
        f.write("done")`
    }
  }
];

const CatalogModal = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '800px' }}>
        <div className="modal-header">
          <h2>Node Catalog</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
          {templates.map((template) => (
            <div key={template.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#f8fafc'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' }}>{template.label}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{template.description}</p>
              </div>
              <button 
                className="btn btn-primary"
                style={{ marginTop: 'auto' }}
                onClick={() => onSelectTemplate(template)}
              >
                Add to Canvas
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CatalogModal;
