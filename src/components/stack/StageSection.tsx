import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ToolCanvas } from "./ToolCanvas";
import type { Stage } from "@/data/stack";

export function StageSection({
  stage,
  index,
  onOpen,
  onInView,
}: {
  stage: Stage;
  index: number;
  onOpen: (id: string) => void;
  onInView: (i: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.25, 1, 1, 0.25]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.96, 1, 1, 0.96]);
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.section
      ref={ref}
      id={`stage-${stage.id}`}
      onViewportEnter={() => onInView(index)}
      viewport={{ amount: 0.5 }}
      style={{ opacity, scale }}
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-24"
    >
      <motion.header style={{ y: headingY }} className="mb-10">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
          style={{
            color: `var(--stage-${stage.accent})`,
            backgroundColor: `color-mix(in oklab, var(--stage-${stage.accent}) 16%, transparent)`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(--stage-${stage.accent})` }} />
          Stage {String(index + 1).padStart(2, "0")}
        </div>
        <h2 className="mt-4 text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {stage.title}
        </h2>
        <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">{stage.subtitle}</p>
      </motion.header>

      <div className="glass-card rounded-3xl p-2">
        <ToolCanvas stage={stage} onOpen={onOpen} />
      </div>
    </motion.section>
  );
}
