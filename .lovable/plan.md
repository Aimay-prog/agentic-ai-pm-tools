## Goal
Expand Mixpanel tracking so every meaningful card, click, and mode change is captured — using event names tied to the card/tool name.

## Current state
- Tracked: `Profile Tab Clicked`, `Outbound Link Clicked`, `Stage Card Clicked` (rail only), page views.
- Not tracked: tool card clicks, theme mode switches, stage view-on-scroll.
- Default theme: **dark**.

## New events

1. **Tool card clicked** — fired from both desktop (`ToolNode.tsx`) and mobile stacked card (`ToolCanvas.tsx`) when a user opens a tool.
   - Event: `Tool Card Clicked`
   - Props: `{ tool_name, tool_id, stage_name }`

2. **Stage viewed on scroll** — fired from `StageSection.tsx` `onViewportEnter` (once per session per stage, to avoid noise).
   - Event: `Stage Viewed`
   - Props: `{ stage_name, stage_index }`

3. **Theme switched** — fired from `ThemeToggle.tsx` when user toggles.
   - Event: `Theme Switched`
   - Props: `{ from, to }` (e.g. `{ from: 'dark', to: 'light' }`)

4. **Keep existing**: `Profile Tab Clicked`, `Outbound Link Clicked`, `Stage Card Clicked` (rail), page views — unchanged.

## Files to edit
- `src/components/stack/ToolNode.tsx` — wrap `onOpen` with `trackEvent('Tool Card Clicked', {...})`.
- `src/components/stack/ToolCanvas.tsx` — same tracking for the mobile card buttons.
- `src/components/stack/StageSection.tsx` — call `trackEvent('Stage Viewed', {...})` inside `onViewportEnter`, guarded by a `useRef` flag so it fires once per stage per session.
- `src/components/stack/ThemeToggle.tsx` — call `trackEvent('Theme Switched', { from, to })` before toggling.

## Notes
- No design, layout, or data changes.
- Also set a Mixpanel super-property `default_theme: 'dark'` once at init (in `src/mixpanel.ts`) so every event carries the app's default, making theme adoption analysis easy.
