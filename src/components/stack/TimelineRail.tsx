import { stages } from "@/data/stack";
import { cn } from "@/lib/utils";

export function TimelineRail({ activeIndex, onJump }: { activeIndex: number; onJump: (i: number) => void }) {
  return (
    <div className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="glass-card pointer-events-auto flex flex-col items-center gap-4 rounded-full px-2 py-4">
        {stages.map((s, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              aria-label={`Jump to ${s.title}`}
              className="group relative flex h-8 w-8 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-2.5 w-2.5 rounded-full transition-all duration-300",
                  active ? "scale-150" : "scale-100 opacity-60",
                )}
                style={{
                  backgroundColor: `var(--stage-${s.accent})`,
                  boxShadow: active ? `0 0 14px 2px var(--stage-${s.accent})` : "none",
                }}
              />
              <span className="pointer-events-none absolute left-10 whitespace-nowrap rounded-md bg-[var(--glass-bg)] px-2 py-1 text-xs text-foreground opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
