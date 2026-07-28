import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function RoadmapFlow({ roadmap = [] }) {

  const nodes = roadmap.map((step, index) => ({
    id: String(index + 1),
    position: {
      x: 250,
      y: index * 120,
    },
    data: {
      label: step,
    },
  }));

  const edges = roadmap
    .slice(1)
    .map((_, index) => ({
      id: `e${index + 1}`,
      source: String(index + 1),
      target: String(index + 2),
    }));

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default RoadmapFlow;