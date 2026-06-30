import { ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { nodes, stages } from "@/data/stack";

export function ToolDetailSheet({
  toolId,
  onClose,
}: {
  toolId: string | null;
  onClose: () => void;
}) {
  const tool = toolId ? nodes.find((n) => n.id === toolId) ?? null : null;
  const stage = tool ? stages.find((s) => s.id === tool.stageId) ?? null : null;

  return (
    <Sheet open={!!tool} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full border-l border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl sm:max-w-md"
      >
        {tool && stage && (
          <>
            <SheetHeader className="space-y-3">
              <div
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                style={{
                  color: `var(--stage-${stage.accent})`,
                  backgroundColor: `color-mix(in oklab, var(--stage-${stage.accent}) 18%, transparent)`,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(--stage-${stage.accent})` }} />
                {stage.title}
              </div>
              <SheetTitle className="text-2xl">{tool.name}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {tool.description}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-6 px-1">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PM Insights</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{tool.insights}</p>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing</h3>
                <p className="mt-2 text-sm text-foreground">{tool.pricing}</p>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tool.links.map((l) => (
                    <Button key={l.url} asChild variant="outline" size="sm">
                      <a href={l.url} target="_blank" rel="noreferrer">
                        {l.label}
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
