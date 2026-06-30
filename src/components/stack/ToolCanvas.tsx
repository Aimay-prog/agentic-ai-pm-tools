import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ToolNode } from "./ToolNode";
import { nodes as allNodes, edges as allEdges, type Stage } from "@/data/stack";

const nodeTypes = { tool: ToolNode };

export function ToolCanvas({ stage, onOpen }: { stage: Stage; onOpen: (id: string) => void }) {
  const { rfNodes, rfEdges } = useMemo(() => {
    const stageNodes = allNodes.filter((n) => n.stageId === stage.id);
    const ids = new Set(stageNodes.map((n) => n.id));
    const rfNodes: Node[] = stageNodes.map((n) => ({
      id: n.id,
      type: "tool",
      position: n.position,
      data: { ...n, onOpen },
      draggable: true,
    }));
    const rfEdges: Edge[] = allEdges
      .filter((e) => ids.has(e.source) && ids.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.animated,
        style: {
          stroke: "var(--connector)",
          strokeWidth: 1.75,
          filter: "drop-shadow(0 0 6px var(--connector-glow))",
        },
        type: "smoothstep",
      }));
    return { rfNodes, rfEdges };
  }, [stage.id, onOpen]);

  return (
    <div className="h-[60vh] w-full">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--connector-glow)" />
      </ReactFlow>
    </div>
  );
}
