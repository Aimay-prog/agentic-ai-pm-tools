import { Handle, Position, type NodeProps } from "reactflow";
import { stages, type ToolNode as ToolNodeData } from "@/data/stack";
import { cn } from "@/lib/utils";

export type ToolNodeProps = NodeProps<ToolNodeData & { onOpen: (id: string) => void }>;

export function ToolNode({ data, selected }: ToolNodeProps) {
  const stage = stages.find((s) => s.id === data.stageId);
  const accent = stage?.accent ?? 1;
  return (
    <div
      onClick={() => data.onOpen(data.id)}
      className={cn(
        "glass-card group w-[240px] cursor-pointer rounded-2xl px-4 py-3 transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-[1.02]",
        selected && "ring-2 ring-[var(--connector)]",
      )}
      style={{
        boxShadow: `0 8px 32px -12px color-mix(in oklab, var(--stage-${accent}) 35%, transparent)`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-[var(--connector)]" />
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            color: `var(--stage-${accent})`,
            backgroundColor: `color-mix(in oklab, var(--stage-${accent}) 18%, transparent)`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(--stage-${accent})` }} />
          {stage?.title}
        </span>
      </div>
      <div className="mt-2 text-base font-semibold text-foreground">{data.name}</div>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{data.description}</p>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-[var(--connector)]" />
    </div>
  );
}
