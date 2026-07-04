# Agentic AI PM Stack — Interactive Visualization

A scroll-driven vertical timeline of 5 PM stages (Discovery → Planning → Design → Orchestration → Analytics). Each stage is a React Flow canvas of glassmorphic tool cards wired with animated connectors. Smooth scroll with focus animation; side panel for tool details; full light/dark theming.

## Stack additions

- `reactflow` — node canvas + edges
- `framer-motion` — scroll/focus animation
- `next-themes` — light/dark toggle with system fallback
- shadcn `Sheet` (already available) — side panel
- shadcn `Button`, `Badge` — already available

## Routes & files

```text
src/routes/index.tsx                 → replace placeholder, render <StackPage />
src/components/stack/
  StackPage.tsx                      → page shell, theme toggle, stage sections
  StageSection.tsx                   → one full-viewport stage w/ Framer scroll focus
  ToolCanvas.tsx                     → React Flow wrapper per stage
  ToolNode.tsx                       → custom glassmorphic node (name, badge, desc)
  ToolDetailSheet.tsx                → side sheet with insights/pricing/links
  ThemeToggle.tsx                    → light/dark switch
  TimelineRail.tsx                   → left-side vertical progress rail
src/data/stack.ts                    → mock { stages, nodes, edges } JSON
src/styles.css                       → add stage color tokens, glass utilities, connector glow
src/routes/__root.tsx                → wrap in ThemeProvider, add font <link>
```

## Data shape (`src/data/stack.ts`)

Swappable JSON — the only file you'd edit later to plug in real tools.

```ts
export type Stage = { id: string; title: string; accent: string };

export type ToolNode = {
  id: string;
  stageId: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  insights: string;
  pricing: string;
  links: { label: string; url: string }[];
};

export type ToolEdge = {
  id: string;
  source: string;        // node id
  target: string;        // node id
  animated?: boolean;
};

export const stages: Stage[]   = [ /* 5 stages */ ];
export const nodes:  ToolNode[] = [ /* 3–4 placeholder tools per stage */ ];
export const edges:  ToolEdge[] = [ /* intra- and cross-stage edges */ ];
```

Initial seed: generic placeholders (Tool A1, Tool A2 …) — 3–4 per stage, with sample edges inside each stage plus a couple cross-stage edges to demonstrate flow.

## Theming

`src/styles.css` adds semantic tokens (no hard-coded colors in components):

- **Light**: page bg = layered radial gradients of pale lilac `oklch(0.96 0.04 300)` + mint `oklch(0.95 0.05 165)` on near-white. Glass: `bg-white/40 backdrop-blur-xl`, border `border-white/60`, shadow `0 8px 32px rgba(180,170,210,0.18)`. Connectors: soft grey `oklch(0.75 0.02 280)`.
- **Dark**: page bg = `bg-zinc-950` with subtle cyan/green radial glows at low opacity. Glass: `bg-white/5 backdrop-blur-xl`, border `border-cyan-500/40`, glow `shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)]`. Connectors: cyan `#22d3ee` with green `#22c55e` accent, animated dash + drop-shadow glow filter.

New tokens added to `:root` / `.dark` and registered under `@theme inline`:
`--stage-1` … `--stage-5`, `--glass-bg`, `--glass-border`, `--connector`, `--connector-glow`.

Stage badges pull from `--stage-N` so each stage has a distinct accent (e.g. violet, sky, rose, amber, emerald) consistent across both modes.

Font: Inter via `<link>` in `__root.tsx` head (per Tailwind v4 rule — no CSS @import for remote fonts). Display weight 600 for stage titles, tabular numerals on metadata.

## Scroll & focus animation (Framer Motion)

- Page is a normal scroll container (no CSS scroll-snap — user picked smooth focus).
- Each `<StageSection>` is `min-h-screen` and uses `useScroll({ target: ref, offset: ['start end', 'end start'] })`.
- Map progress → `opacity` (0.35 → 1 → 0.35), `scale` (0.96 → 1 → 0.96), and a subtle `y` parallax on the heading.
- The active stage's React Flow canvas fades its edges in with staggered `pathLength` animation when it enters focus.
- Left-side `TimelineRail` shows 5 dots; the active dot scales + glows based on which section is most in view (IntersectionObserver).

## React Flow canvas (per stage)

- One `<ReactFlow>` instance per stage, height `~70vh`, `panOnDrag={false}`, `zoomOnScroll={false}`, `nodesDraggable` so cards can be repositioned.
- Custom `ToolNode` type registered via `nodeTypes={{ tool: ToolNode }}`.
- Edges use a custom edge style: `stroke: var(--connector)`, `strokeDasharray` animated, `filter: url(#connector-glow)` in dark mode (SVG filter defined once on the page).
- Edges are marked `animated: true` so React Flow's built-in dash animation runs; we layer Framer Motion `pathLength` for the initial reveal.
- Cross-stage edges: rendered in a single page-level overlay SVG that reads node DOM positions via refs (since React Flow instances are stage-scoped). Falls back to in-stage edges only if overlay measurement is unavailable.

## Card (`ToolNode`)

```text
┌────────────────────────────────┐
│ ● Stage badge        [icon]    │
│ Tool Name                      │
│ Short description, 2 lines max │
└────────────────────────────────┘
```

- Glass styles via `bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl`.
- Hover: `scale-[1.02]`, border opacity bumps, dark mode adds stronger cyan glow.
- Click → opens `ToolDetailSheet` with that node's `insights`, `pricing`, `links[]`.
- Drag handle is the whole card; React Flow updates position in local state (not persisted — fine for v1).

## Side panel (`ToolDetailSheet`)

shadcn `Sheet` from the right, width `sm:max-w-md`. Sections: Stage badge + tool name header, "PM Insights" prose block, "Pricing" line, outbound link buttons (open in new tab). Closes on outside click / Esc.

## Theme toggle

`next-themes` provider in `__root.tsx` with `attribute="class"` and `defaultTheme="dark"`. `ThemeToggle` is a fixed top-right button (sun/moon icon swap, animated with Framer `AnimatePresence`).

## Index route metadata

Update `head()` in `src/routes/index.tsx`: title "Agentic AI PM Stack", description one-liner, og:title/description. Single H1 on the hero ("The Agentic AI PM Stack").

## Out of scope (v1)

- Persisting node positions
- Editing nodes/edges in-UI (data is JSON-only)
- Real tool content (placeholder seed only — you'll swap `src/data/stack.ts`)
- Mobile drag interactions on React Flow (canvas is read-mostly on small screens; cards still tappable)

## Verification

After build: load `/`, toggle theme, scroll through all 5 stages confirming focus animation + connector reveal, click a card to open the sheet, drag a card to confirm React Flow interactivity. Check console for React Flow "parent container needs a width/height" warnings and resolve if present.
