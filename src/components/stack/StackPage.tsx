import { useCallback, useRef, useState } from "react";
import { User } from "lucide-react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { TimelineRail } from "./TimelineRail";
import { GlobalToolCanvas, type GlobalToolCanvasHandle } from "./GlobalToolCanvas";
import { ToolDetailSheet } from "./ToolDetailSheet";
import { ProfileSheet } from "./ProfileSheet";
import { stages } from "@/data/stack";
import { trackEvent } from "@/mixpanel";

function StackPageInner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const canvasRef = useRef<GlobalToolCanvasHandle>(null);

  const handleJump = useCallback((i: number) => {
    trackEvent("Stage Card Clicked", { stage_name: stages[i].title });
    setActiveIndex(i);
    canvasRef.current?.focusStage(stages[i].id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div aria-hidden className="page-aurora" />

      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            trackEvent("Profile Tab Clicked");
            setProfileOpen(true);
          }}
          aria-label="Open profile"
          className="glass-card flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105"
        >
          <User className="h-5 w-5" />
        </button>
        <ThemeToggle />
      </div>
      <TimelineRail activeIndex={activeIndex} onJump={handleJump} />

      <header className="relative mx-auto flex max-w-6xl flex-col justify-center px-6 pt-24 pb-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl">
          A living map · 2026
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
          The Agentic AI PM Stack
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          Five stages, every tool an autonomous teammate. Pan and zoom the map, or use the timeline on the left
          to jump between stages. Click any card to inspect how it plugs in.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleJump(i)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-xs font-medium backdrop-blur-xl transition-transform hover:-translate-y-0.5"
              style={{ color: `var(--stage-${s.accent})` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(--stage-${s.accent})` }} />
              {s.title}
            </button>
          ))}
        </div>
      </header>

      <main className="relative mx-auto max-w-[1400px] px-6 pb-16">
        <div className="glass-card rounded-3xl p-2">
          <div className="h-[85vh] min-h-[600px] w-full">
            <GlobalToolCanvas ref={canvasRef} onOpen={setOpenTool} />
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/m-apoorva/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Apoorva Mathur
        </a>
      </footer>

      <ToolDetailSheet toolId={openTool} onClose={() => setOpenTool(null)} />
      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
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
