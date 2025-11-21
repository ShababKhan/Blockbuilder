import React from 'react';
import { getSmoothStepPath, BaseEdge } from 'reactflow';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  const gradientId = `edge-gradient-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1={sourceX} y1={sourceY} x2={targetX} y2={targetY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="33.33%" stopColor="#ef4444" />
          <stop offset="33.33%" stopColor="#000000" />
          <stop offset="66.66%" stopColor="#000000" />
          <stop offset="66.66%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: `url(#${gradientId})` }}
      />
    </>
  );
}
