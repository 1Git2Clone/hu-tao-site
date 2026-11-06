import { TECH_URLS } from "./tech";

export type Tech = keyof typeof TECH_URLS;

export interface SkillGroup {
  group: string;
  items: Tech[];
}

export const SKILLS: SkillGroup[] = [
  {
    group: "Languages",
    items: ["Go", "Rust", "TypeScript", "Python", "C++", "Shell"],
  },
  { group: "Backend", items: ["Axum", "Actix", "Tokio", "Serenity"] },
  { group: "Frontend", items: ["Svelte", "React", "TailwindCSS"] },
  { group: "Data", items: ["PostgreSQL", "SQLite3"] },
  {
    group: "Infrastructure",
    items: [
      "Nix",
      "Docker",
      "Caddy",
      "OpenTofu",
      "AWS Lambda",
      "Amazon S3",
      "Hetzner Cloud",
      "Scaleway",
    ],
  },
  { group: "Observability", items: ["Grafana", "OpenTelemetry", "Prometheus"] },
  { group: "AI", items: ["OpenAI", "Gemini", "Claude"] },
];
