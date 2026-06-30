export type Stage = {
  id: string;
  title: string;
  subtitle: string;
  /** Index into --stage-1..--stage-5 tokens (1-based). */
  accent: 1 | 2 | 3 | 4 | 5;
};

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
  source: string;
  target: string;
  animated?: boolean;
};

export const stages: Stage[] = [
  {
    id: "discovery",
    title: "Discovery",
    subtitle: "Surface signals, interviews, and unmet needs.",
    accent: 1,
  },
  {
    id: "planning",
    title: "Planning",
    subtitle: "Turn signals into specs, PRDs, and roadmaps.",
    accent: 2,
  },
  {
    id: "design",
    title: "Design",
    subtitle: "Sketch, prototype, and pressure-test the experience.",
    accent: 3,
  },
  {
    id: "orchestration",
    title: "Orchestration",
    subtitle: "Coordinate agents, engineers, and delivery.",
    accent: 4,
  },
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Measure adoption, retention, and outcomes.",
    accent: 5,
  },
];

const lorem =
  "Replace this with a real description of how the tool slots into the workflow.";
const insights =
  "Replace this with deep PM insights: when to reach for it, what it replaces, integration tips, and known sharp edges.";

export const nodes: ToolNode[] = [
  // Discovery
  { id: "d1", stageId: "discovery", name: "Tool A1", description: lorem, position: { x: 40, y: 60 }, insights, pricing: "Free tier · $— per seat", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "d2", stageId: "discovery", name: "Tool A2", description: lorem, position: { x: 340, y: 40 }, insights, pricing: "$— per month", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "d3", stageId: "discovery", name: "Tool A3", description: lorem, position: { x: 640, y: 120 }, insights, pricing: "Enterprise", links: [{ label: "Website", url: "https://example.com" }] },

  // Planning
  { id: "p1", stageId: "planning", name: "Tool B1", description: lorem, position: { x: 40, y: 40 }, insights, pricing: "Free", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "p2", stageId: "planning", name: "Tool B2", description: lorem, position: { x: 340, y: 140 }, insights, pricing: "$— per seat", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "p3", stageId: "planning", name: "Tool B3", description: lorem, position: { x: 640, y: 40 }, insights, pricing: "$— per month", links: [{ label: "Website", url: "https://example.com" }] },

  // Design
  { id: "ds1", stageId: "design", name: "Tool C1", description: lorem, position: { x: 60, y: 80 }, insights, pricing: "$— per seat", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "ds2", stageId: "design", name: "Tool C2", description: lorem, position: { x: 360, y: 40 }, insights, pricing: "Free tier", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "ds3", stageId: "design", name: "Tool C3", description: lorem, position: { x: 640, y: 140 }, insights, pricing: "$— per month", links: [{ label: "Website", url: "https://example.com" }] },

  // Orchestration
  { id: "o1", stageId: "orchestration", name: "Tool D1", description: lorem, position: { x: 40, y: 60 }, insights, pricing: "$— per seat", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "o2", stageId: "orchestration", name: "Tool D2", description: lorem, position: { x: 340, y: 140 }, insights, pricing: "Free tier", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "o3", stageId: "orchestration", name: "Tool D3", description: lorem, position: { x: 640, y: 60 }, insights, pricing: "Enterprise", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "o4", stageId: "orchestration", name: "Tool D4", description: lorem, position: { x: 340, y: 240 }, insights, pricing: "$— per month", links: [{ label: "Website", url: "https://example.com" }] },

  // Analytics
  { id: "a1", stageId: "analytics", name: "Tool E1", description: lorem, position: { x: 60, y: 80 }, insights, pricing: "$— per seat", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "a2", stageId: "analytics", name: "Tool E2", description: lorem, position: { x: 360, y: 40 }, insights, pricing: "Free", links: [{ label: "Website", url: "https://example.com" }] },
  { id: "a3", stageId: "analytics", name: "Tool E3", description: lorem, position: { x: 640, y: 140 }, insights, pricing: "$— per month", links: [{ label: "Website", url: "https://example.com" }] },
];

export const edges: ToolEdge[] = [
  // Discovery
  { id: "e-d1-d2", source: "d1", target: "d2", animated: true },
  { id: "e-d2-d3", source: "d2", target: "d3", animated: true },
  // Planning
  { id: "e-p1-p2", source: "p1", target: "p2", animated: true },
  { id: "e-p2-p3", source: "p2", target: "p3", animated: true },
  { id: "e-p1-p3", source: "p1", target: "p3", animated: true },
  // Design
  { id: "e-ds1-ds2", source: "ds1", target: "ds2", animated: true },
  { id: "e-ds2-ds3", source: "ds2", target: "ds3", animated: true },
  // Orchestration
  { id: "e-o1-o2", source: "o1", target: "o2", animated: true },
  { id: "e-o2-o3", source: "o2", target: "o3", animated: true },
  { id: "e-o2-o4", source: "o2", target: "o4", animated: true },
  { id: "e-o4-o3", source: "o4", target: "o3", animated: true },
  // Analytics
  { id: "e-a1-a2", source: "a1", target: "a2", animated: true },
  { id: "e-a2-a3", source: "a2", target: "a3", animated: true },
  { id: "e-a1-a3", source: "a1", target: "a3", animated: true },
];
