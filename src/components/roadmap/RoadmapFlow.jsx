import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function RoadmapFlow({ roadmap = [] }) {
  const nodes = roadmap.map((item, index) => ({
    id: String(index + 1),

    position: {
      x: 250,
      y: index * 140,
    },

    data: {
      label:
        typeof item === "string" ? (
          <div className="font-semibold">{item}</div>
        ) : (
          <div className="p-2">
            <h3 className="font-bold text-blue-600">
              Step {item.step}
            </h3>

            <h4 className="font-semibold">
              {item.title}
            </h4>

            <p className="text-sm text-gray-600">
              {item.description}
            </p>
          </div>
        ),
    },
  }));

  const edges = roadmap.slice(1).map((_, index) => ({
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