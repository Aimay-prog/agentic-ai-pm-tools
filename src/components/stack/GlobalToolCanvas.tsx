import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
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

// Layout tuning
const NODE_W = 240;
const NODE_H = 116;
const GAP_X = 60;
const GAP_Y = 60;
const STAGE_GAP = 160; // extra vertical space between stages
const STAGE_LABEL_H = 80; // reserved for the stage banner rendered per band

export type GlobalToolCanvasHandle = {
  focusStage: (stageId: string) => void;
};

type Props = { onOpen: (id: string) => void };

function useCols() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(1);
      else if (w < 1024) setCols(2);
      else setCols(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return cols;
}

const InnerCanvas = forwardRef<GlobalToolCanvasHandle, Props>(function InnerCanvas({ onOpen }, ref) {
  const rf = useReactFlow();
  const cols = useCols();

  const { rfNodes, rfEdges } = useMemo(() => {
    const stageNodeMap = new Map<string, typeof allNodes>();
    stages.forEach((s) => stageNodeMap.set(s.id, []));
    allNodes.forEach((n) => stageNodeMap.get(n.stageId)?.push(n));

    const positions = new Map<string, { x: number; y: number; stageId: string }>();
    let yCursor = 0;
    const totalWidth = cols * NODE_W + (cols - 1) * GAP_X;

    stages.forEach((stage) => {
      const stageNodes = stageNodeMap.get(stage.id) ?? [];
      const rows = Math.max(1, Math.ceil(stageNodes.length / cols));
      const bandTop = yCursor + STAGE_LABEL_H;

      stageNodes.forEach((n, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        // Center a short last row
        const nodesInRow =
          row === rows - 1 ? stageNodes.length - row * cols : cols;
        const rowWidth = nodesInRow * NODE_W + (nodesInRow - 1) * GAP_X;
        const rowOffset = (totalWidth - rowWidth) / 2;
        positions.set(n.id, {
          x: rowOffset + col * (NODE_W + GAP_X),
          y: bandTop + row * (NODE_H + GAP_Y),
          stageId: stage.id,
        });
      });

      yCursor = bandTop + rows * (NODE_H + GAP_Y) + STAGE_GAP;
    });

    const rfNodes: Node[] = allNodes.map((n) => {
      const pos = positions.get(n.id)!;
      return {
        id: n.id,
        type: "tool",
        position: { x: pos.x, y: pos.y },
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
  }, [onOpen, cols]);

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
      fitViewOptions={{ padding: 0.15 }}
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
