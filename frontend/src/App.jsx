import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

import CustomNode from './components/CustomNode';
import CustomEdge from './components/CustomEdge';
import NodeModal from './components/NodeModal';
import CatalogModal from './components/CatalogModal';
import LoadWorkflowModal from './components/LoadWorkflowModal';
import WelcomeScreen from './components/WelcomeScreen';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
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
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [workflowName, setWorkflowName] = useState('My Workflow');

  const defaultEdgeOptions = {
    type: 'customEdge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#22c55e',
    },
    style: {
      strokeWidth: 2,
    },
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: 'customEdge' }, eds)), [setEdges]);

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

  const addTemplateNode = (template) => {
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type: 'customNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label: template.label, 
        status: 'idle', 
        config: template.config 
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setCatalogOpen(false);
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

  const handleLoadWorkflow = (workflowData) => {
    setNodes(workflowData.nodes || []);
    setEdges(workflowData.edges || []);
    // If the loaded workflow has a name property, use it, otherwise keep current or derive from filename if passed
    // For now, we don't get the name back in the body unless we saved it there.
    // The backend load_workflow returns the JSON content.
    // Let's assume the user wants to keep working on it.
    // We might want to update the workflowName state if we knew the name.
    // But the load_workflow endpoint returns the JSON content which might not have the name field if we didn't save it.
    // Let's check save_workflow in backend. It saves nodes and edges.
    // We should probably save the name too.
    // For now, just load nodes and edges.
    setLoadModalOpen(false);
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNodeId)?.data;

  if (view === 'welcome') {
    return <WelcomeScreen onCreateNew={handleCreateNew} onLoadExample={handleLoadExample} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Top Left Toolbar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input 
                type="text" 
                value={workflowName} 
                onChange={(e) => setWorkflowName(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#1e293b',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    width: '200px'
                }}
            />
            <button 
                onClick={saveWorkflow}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#0f172a',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px'
                }}
                title="Save Workflow"
            >
                Save
            </button>
            <button 
                onClick={() => setLoadModalOpen(true)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#0f172a',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px'
                }}
                title="Open Workflow"
            >
                Open...
            </button>
        </div>
        <button 
            onClick={addNewNode}
            style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#0f172a',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                width: '200px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
            }}
        >
            + Add Node
        </button>
        <button 
            onClick={deleteSelectedNode}
            style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                backgroundColor: '#fff',
                color: '#dc2626',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                width: '200px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
            }}
        >
            Delete Selected
        </button>

        <div style={{ height: '20px' }}></div>

        <button 
            onClick={() => setCatalogOpen(true)}
            style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: 'white',
                color: '#475569',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                width: '200px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            📚 Catalog
        </button>
      </div>

      {/* Top Right Toolbar */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100
      }}>
        <button 
            onClick={() => setView('welcome')}
            style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: 'white',
                color: '#475569',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px'
            }}
        >
            Home
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        defaultEdgeOptions={defaultEdgeOptions}
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

      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onSelectTemplate={addTemplateNode}
      />

      <LoadWorkflowModal
        isOpen={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        onLoadWorkflow={handleLoadWorkflow}
      />
    </div>
  );
}
