import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ToolNode } from "./ToolNode";
import { nodes as allNodes, edges as allEdges, stages } from "@/data/stack";

const nodeTypes = { tool: ToolNode };
const BAND_WIDTH = 900;

export type GlobalToolCanvasHandle = {
  focusStage: (stageId: string) => void;
};

type Props = { onOpen: (id: string) => void };

const InnerCanvas = forwardRef<GlobalToolCanvasHandle, Props>(function InnerCanvas({ onOpen }, ref) {
  const rf = useReactFlow();
  const stageIndex = useMemo(() => {
    const m = new Map<string, number>();
    stages.forEach((s, i) => m.set(s.id, i));
    return m;
  }, []);

  const { rfNodes, rfEdges } = useMemo(() => {
    const rfNodes: Node[] = allNodes.map((n) => {
      const i = stageIndex.get(n.stageId) ?? 0;
      return {
        id: n.id,
        type: "tool",
        position: { x: n.position.x + i * BAND_WIDTH, y: n.position.y },
        data: { ...n, onOpen },
        draggable: true,
      };
    });
    const rfEdges: Edge[] = allEdges.map((e) => ({
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
  }, [onOpen, stageIndex]);

  useImperativeHandle(ref, () => ({
    focusStage: (stageId: string) => {
      const stageNodes = rfNodes.filter((n) => {
        const data = n.data as { stageId?: string } | undefined;
        return data?.stageId === stageId;
      });
      if (stageNodes.length === 0) return;
      rf.fitView({ nodes: stageNodes.map((n) => ({ id: n.id })), padding: 0.3, duration: 600 });
    },
  }));

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.15}
      maxZoom={1.5}
      panOnDrag
      panOnScroll={false}
      zoomOnScroll
      zoomOnPinch
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--connector-glow)" />
      <Controls showInteractive={false} className="!bg-transparent" />
      <MiniMap
        pannable
        zoomable
        maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
        nodeColor={(n) => {
          const stageId = (n.data as { stageId?: string } | undefined)?.stageId;
          const accent = stages.find((s) => s.id === stageId)?.accent ?? 1;
          return `var(--stage-${accent})`;
        }}
        style={{
          background: "color-mix(in oklab, var(--background) 60%, transparent)",
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
        }}
      />
    </ReactFlow>
  );
});

export const GlobalToolCanvas = forwardRef<GlobalToolCanvasHandle, Props>(function GlobalToolCanvas(
  props,
  ref,
) {
  const innerRef = useRef<GlobalToolCanvasHandle>(null);
  useImperativeHandle(ref, () => ({
    focusStage: (id) => innerRef.current?.focusStage(id),
  }));
  return (
    <ReactFlowProvider>
      <InnerCanvas ref={innerRef} {...props} />
    </ReactFlowProvider>
  );
});
