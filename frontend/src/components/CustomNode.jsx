import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: '#ffffff',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      minWidth: '180px',
      textAlign: 'left',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#22c55e', width: 12, height: 12, border: '2px solid #fff' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>{data.label}</div>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: data.status === 'success' ? '#22c55e' : data.status === 'error' ? '#ef4444' : data.status === 'running' ? '#3b82f6' : '#cbd5e1'
        }} />
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: '#64748b',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '8px',
        marginTop: '4px'
      }}>
        {data.status === 'idle' ? 'Ready' : data.status.charAt(0).toUpperCase() + data.status.slice(1)}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: '#ef4444', width: 12, height: 12, border: '2px solid #fff' }}
      />
    </div>
  );
};

export default memo(CustomNode);
