import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ToolNode } from "./ToolNode";
import { nodes as allNodes, edges as allEdges, stages, type Stage } from "@/data/stack";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/mixpanel";

const nodeTypes = { tool: ToolNode };

export function ToolCanvas({ stage, onOpen }: { stage: Stage; onOpen: (id: string) => void }) {
  const isMobile = useIsMobile();
  const stageNodes = useMemo(
    () => allNodes.filter((n) => n.stageId === stage.id),
    [stage.id],
  );

  const { rfNodes, rfEdges } = useMemo(() => {
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
  }, [stageNodes, onOpen]);

  if (isMobile) {
    const stageMeta = stages.find((s) => s.id === stage.id);
    const accent = stageMeta?.accent ?? 1;
    return (
      <div className="flex w-full flex-col gap-3 p-3">
        {stageNodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onOpen(n.id)}
            className={cn(
              "glass-card w-full rounded-2xl px-4 py-3 text-left transition-transform active:scale-[0.98]",
            )}
            style={{
              boxShadow: `0 8px 32px -12px color-mix(in oklab, var(--stage-${accent}) 35%, transparent)`,
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{
                color: `var(--stage-${accent})`,
                backgroundColor: `color-mix(in oklab, var(--stage-${accent}) 18%, transparent)`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: `var(--stage-${accent})` }}
              />
              {stageMeta?.title}
            </span>
            <div className="mt-2 text-base font-semibold text-foreground">{n.name}</div>
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{n.description}</p>
          </button>
        ))}
      </div>
    );
  }

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
