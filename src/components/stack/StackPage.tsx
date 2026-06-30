import { useCallback, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { TimelineRail } from "./TimelineRail";
import { StageSection } from "./StageSection";
import { ToolDetailSheet } from "./ToolDetailSheet";
import { stages } from "@/data/stack";

function StackPageInner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openTool, setOpenTool] = useState<string | null>(null);

  const handleJump = useCallback((i: number) => {
    const el = document.getElementById(`stage-${stages[i].id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div aria-hidden className="page-aurora" />

      <ThemeToggle />
      <TimelineRail activeIndex={activeIndex} onJump={handleJump} />

      <header className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 pt-24">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl">
          A living map · 2026
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
          The Agentic AI PM Stack
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Scroll the timeline. Five stages, every tool an autonomous teammate. Click any card to inspect how it plugs in.
        </p>
      </header>

      <main className="relative">
        {stages.map((stage, i) => (
          <StageSection key={stage.id} stage={stage} index={i} onOpen={setOpenTool} onInView={setActiveIndex} />
        ))}
      </main>

      <footer className="relative mx-auto max-w-6xl px-6 py-16 text-center text-xs text-muted-foreground">
        Mock data — swap <code className="rounded bg-[var(--glass-bg)] px-1 py-0.5">src/data/stack.ts</code> to plug in your own tools and edges.
      </footer>

      <ToolDetailSheet toolId={openTool} onClose={() => setOpenTool(null)} />
    </div>
  );
}

export function StackPage() {
  return (
    <ThemeProvider>
      <StackPageInner />
    </ThemeProvider>
  );
}
