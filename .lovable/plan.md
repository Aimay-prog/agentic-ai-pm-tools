## Goal
Replace the five per-stage canvases with **one unified canvas** that shows every tool and every connector (including cross-stage edges like `perplexity → lovable`) in a single view.

## Changes

### 1. New `GlobalToolCanvas.tsx`
- Renders **all** nodes and **all** edges from `src/data/stack.ts` in one ReactFlow instance.
- Lays out nodes by stage: each stage occupies a horizontal band (offset each node's `x` by `stageIndex * BAND_WIDTH`, keep existing `y`). This preserves the hand-authored layout inside each stage while spreading stages left-to-right, so cross-stage edges have room to draw.
- Colors each node by its stage accent (already handled inside `ToolNode`).
- Enables pan + zoom + `fitView` so users can navigate the full map. Adds a floating stage legend at the top.
- Exposes a `focusStage(stageId)` handle so the timeline rail can `fitView` on that stage's nodes.

### 2. `StackPage.tsx`
- Remove the `stages.map(... <StageSection />)` loop.
- Render a single full-viewport section containing `<GlobalToolCanvas />`.
- Keep the hero header, profile button, theme toggle, footer, and `ToolDetailSheet` / `ProfileSheet`.
- Keep `TimelineRail`: `handleJump` now calls `focusStage(stages[i].id)` on the canvas ref (still fires the existing `Stage Card Clicked` Mixpanel event).

### 3. Delete `StageSection.tsx` and `ToolCanvas.tsx`
- Both are superseded by `GlobalToolCanvas`. Removing avoids dead code.

### 4. No changes to
- `src/data/stack.ts` (data stays as-is — the cross-stage edges you authored will now render).
- `ToolNode.tsx`, `ToolDetailSheet.tsx`, `ProfileSheet.tsx`, Mixpanel wiring, theme, styles.

## Technical notes
- ReactFlow: enable `panOnDrag`, `panOnScroll={false}`, `zoomOnScroll`, `zoomOnPinch`, plus a `<Controls />` and `<MiniMap />` for navigation on a larger graph.
- Stage bands: `BAND_WIDTH ≈ 900px`, so stage `i` shifts every node by `i * 900` on the x axis. Node `y` positions are untouched, keeping the existing intra-stage composition.
- Edge styling stays identical (`smoothstep`, animated, connector glow).
- `focusStage` uses `reactFlowInstance.fitView({ nodes: stageNodes, padding: 0.3, duration: 600 })`.

## Out of scope
- No changes to data, tool detail content, tracking events, or the profile panel.
