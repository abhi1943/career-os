import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function RoadmapFlow({
    roadmap = [],
}) {
    const nodes = roadmap.map(
        (item, index) => ({
            id: String(
                item?.id ??
                index + 1
            ),

            position: {
                x: 250,
                y: index * 180,
            },

            data: {
                label: (
                    <div className="p-3 min-w-[220px]">

                        <div className="font-bold text-blue-600">
                            Step {index + 1}
                        </div>

                        <h3 className="font-semibold mt-1">
                            {item?.title ||
                                "Roadmap Stage"}
                        </h3>

                        {item?.duration && (
                            <p className="text-sm text-gray-500 mt-1">
                                {item.duration}
                            </p>
                        )}

                        {Array.isArray(
                            item?.skills
                        ) &&
                            item.skills.length >
                                0 && (

                                <div className="mt-2 text-xs text-gray-600">
                                    {item.skills.join(
                                        " • "
                                    )}
                                </div>
                            )}

                    </div>
                ),
            },
        })
    );

    const edges = roadmap
        .slice(1)
        .map((item, index) => ({
            id: `e${index + 1}`,

            source: String(
                roadmap[index]?.id ??
                index + 1
            ),

            target: String(
                item?.id ??
                index + 2
            ),
        }));

    if (roadmap.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                width: "100%",
                height: "700px",
            }}
        >
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