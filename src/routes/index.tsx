import { createFileRoute } from "@tanstack/react-router";
import { StackPage } from "@/components/stack/StackPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Agentic AI PM Stack" },
      {
        name: "description",
        content:
          "An interactive vertical timeline of the agentic AI tools powering modern product management — discovery, planning, design, orchestration, and analytics.",
      },
      { property: "og:title", content: "The Agentic AI PM Stack" },
      {
        property: "og:description",
        content:
          "An interactive vertical timeline of the agentic AI tools powering modern product management.",
      },
    ],
  }),
  component: StackPage,
});
