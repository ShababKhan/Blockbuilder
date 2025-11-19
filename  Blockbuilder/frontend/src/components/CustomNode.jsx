import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div style={{
      padding: '10px 20px',
      borderRadius: '12px',
      background: '#81D4FA', // Default blue
      color: '#37474F',
      border: '2px solid rgba(0,0,0,0.1)',
      boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
      minWidth: '150px',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <div>
        {data.label}
      </div>
      <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.8 }}>
        {data.status || 'idle'}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: '#555', width: 10, height: 10 }}
      />
    </div>
  );
};

export default memo(CustomNode);
