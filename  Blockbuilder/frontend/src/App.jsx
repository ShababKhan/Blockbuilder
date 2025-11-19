import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

import CustomNode from './components/CustomNode';
import NodeModal from './components/NodeModal';
import WelcomeScreen from './components/WelcomeScreen';

const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 50 },
    data: { label: 'Start Node', status: 'idle', config: {} },
  },
];

const initialEdges = [];

export default function App() {
  const [view, setView] = useState('welcome'); // 'welcome' | 'canvas'
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [workflowName, setWorkflowName] = useState('My Workflow');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
    setModalOpen(true);
  };

  // --- Welcome Screen Actions ---
  const handleCreateNew = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setWorkflowName('New Workflow');
    setView('canvas');
  };

  const handleLoadExample = () => {
    // Mock loading an example
    const exampleNodes = [
      {
        id: '1',
        type: 'customNode',
        position: { x: 100, y: 100 },
        data: { 
            label: 'Load CSV', 
            status: 'idle', 
            config: { 
                naturalLanguage: 'Load customer data',
                pythonScript: 'def run(input_path, output_path):\n    print("Loading data...")'
            } 
        },
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 400, y: 100 },
        data: { 
            label: 'Filter Data', 
            status: 'idle',
            config: {
                naturalLanguage: 'Filter by age > 18',
                pythonScript: 'def run(input_path, output_path):\n    print("Filtering data...")'
            }
        },
      }
    ];
    const exampleEdges = [{ id: 'e1-2', source: '1', target: '2' }];
    
    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setWorkflowName('Example Workflow');
    setView('canvas');
  };

  // --- Canvas Actions ---
  const handleSaveNode = (formData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: formData.label,
              config: {
                naturalLanguage: formData.naturalLanguage,
                pseudocode: formData.pseudocode,
                pythonScript: formData.pythonScript,
              },
            },
          };
        }
        return node;
      })
    );
    setModalOpen(false);
  };

  const handleRunNode = async () => {
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return;

    // Simple mock paths for POC
    const inputPath = `/tmp/workflow/node-${parseInt(node.id) - 1}/output.txt`; 
    const outputPath = `/tmp/workflow/${node.id}/output.txt`;

    try {
      // Update status to running
      setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: 'running' } } : n));

      const response = await axios.post('http://localhost:8000/execute-node', {
        nodeId: node.id,
        script: node.data.config?.pythonScript || '',
        inputPath,
        outputPath
      });

      console.log("Execution Result:", response.data);
      
      // Update status based on result
      const status = response.data.status === 'success' ? 'success' : 'error';
      setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status } } : n));
      
      if(status === 'error') {
          alert(`Error: ${response.data.error}`);
      } else {
          alert(`Success! Output: ${response.data.logs}`);
      }

    } catch (error) {
      console.error(error);
      setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: 'error' } } : n));
      alert("Failed to connect to backend.");
    }
  };

  const addNewNode = () => {
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type: 'customNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${id}`, status: 'idle', config: {} },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const deleteSelectedNode = useCallback(() => {
    // We need to know which node is selected. 
    // React Flow's onSelectionChange could track this, but for now we rely on selectedNodeId 
    // which is set on click. However, clicking the canvas might deselect.
    // A better way for "Delete Selected" button is to use the `useReactFlow` hook or track selection state.
    // For this POC, we will delete the node that was last clicked (selectedNodeId).
    
    if (!selectedNodeId) {
        alert("Click a node to select it first.");
        return;
    }

    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
    setModalOpen(false); // Close modal if open
  }, [selectedNodeId, setNodes, setEdges]);

  const saveWorkflow = async () => {
    try {
        const response = await axios.post('http://localhost:8000/save-workflow', {
            name: workflowName.replace(/\s+/g, '_').toLowerCase(),
            nodes: nodes,
            edges: edges
        });
        alert(`Workflow saved successfully!\nPath: ${response.data.path}`);
    } catch (error) {
        console.error(error);
        alert("Failed to save workflow.");
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNodeId)?.data;

  if (view === 'welcome') {
    return <WelcomeScreen onCreateNew={handleCreateNew} onLoadExample={handleLoadExample} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Toolbar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 100,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
            onClick={addNewNode}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FFD600',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #FBC02D'
            }}
        >
            + Add Node
        </button>
        <button 
            onClick={deleteSelectedNode}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FFAB91',
                color: '#BF360C',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #D84315'
            }}
        >
            - Delete Selected
        </button>
        <button 
            onClick={saveWorkflow}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#A5D6A7',
                color: '#1B5E20',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #2E7D32'
            }}
        >
            💾 Save Workflow
        </button>
        <button 
            onClick={() => setView('welcome')}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ECEFF1',
                color: '#546E7A',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #CFD8DC'
            }}
        >
            🏠 Home
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#ccc" gap={20} />
        <Controls />
      </ReactFlow>

      <NodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        nodeData={selectedNodeData}
        onSave={handleSaveNode}
        onRun={handleRunNode}
        onDelete={deleteSelectedNode}
      />
    </div>
  );
}
