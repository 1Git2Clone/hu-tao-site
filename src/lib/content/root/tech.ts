import type { LinkIcon } from "$lib/components/LinkCard.svelte";
import Actix from "$lib/components/icons/Actix.svelte";
import Caddy from "$lib/components/icons/Caddy.svelte";
import Claude from "$lib/components/icons/Claude.svelte";
import Gemini from "$lib/components/icons/Gemini.svelte";
import Hetzner from "$lib/components/icons/Hetzner.svelte";
import OpenAI from "$lib/components/icons/OpenAI.svelte";
import OpenTofu from "$lib/components/icons/OpenTofu.svelte";
import Scaleway from "$lib/components/icons/Scaleway.svelte";
import Tokio from "$lib/components/icons/Tokio.svelte";

type TechRef = { url: string; ariaLabel?: string; icon?: LinkIcon };

export const COMPUTE_SERVICES = {
  "AWS Lambda": { url: "https://aws.amazon.com/lambda/", icon: "md-lambda" },
  "AWS EC2": { url: "https://aws.amazon.com/ec2/" },
  "AWS ECS": { url: "https://aws.amazon.com/ecs/" },
  "Hetzner Cloud": { url: "https://www.hetzner.com/cloud/", icon: Hetzner },
  Scaleway: { url: "https://www.scaleway.com/", icon: Scaleway },
} as const satisfies Record<string, TechRef>;
export type ComputeService = keyof typeof COMPUTE_SERVICES;

export const STORAGE_SERVICES = {
  "Amazon S3": { url: "https://aws.amazon.com/s3/", icon: "md-aws" },
  "Amazon EBS": { url: "https://aws.amazon.com/ebs/" },
  "Amazon EFS": { url: "https://aws.amazon.com/efs/" },
} as const satisfies Record<string, TechRef>;
export type StorageService = keyof typeof STORAGE_SERVICES;

export const DEVOPS_TOOLS = {
  Docker: { url: "https://www.docker.com/", icon: "dev-docker" },
  Kubernetes: { url: "https://kubernetes.io/" },
  "GitHub Actions": { url: "https://github.com/features/actions" },
  Nix: { url: "https://nixos.org/", icon: "linux-nixos" },
  OpenTofu: { url: "https://opentofu.org/", icon: OpenTofu },
  Caddy: { url: "https://caddyserver.com/", icon: Caddy },
} as const satisfies Record<string, TechRef>;
export type DevOps = keyof typeof DEVOPS_TOOLS;

export const OBSERVABILITY_TOOLS = {
  Prometheus: { url: "https://prometheus.io/", icon: "dev-prometheus" },
  Grafana: { url: "https://grafana.com/", icon: "dev-grafana" },
  OpenTelemetry: {
    url: "https://opentelemetry.io/",
    icon: "dev-opentelemetry",
  },
} as const satisfies Record<string, TechRef>;
export type ObservabilityTool = keyof typeof OBSERVABILITY_TOOLS;

export const FRONTEND_LIBRARIES = {
  React: { url: "https://react.dev/", icon: "dev-react" },
  Svelte: { url: "https://svelte.dev/", icon: "dev-svelte" },
  TailwindCSS: { url: "https://tailwindcss.com/", icon: "dev-tailwindcss" },
} as const satisfies Record<string, TechRef>;
export type FrontendLibrary = keyof typeof FRONTEND_LIBRARIES;

export const BACKEND_LIBRARIES = {
  Axum: { url: "https://github.com/tokio-rs/axum" },
  Actix: { url: "https://actix.rs/", icon: Actix },
  Tokio: { url: "https://tokio.rs/", icon: Tokio },
  Serenity: { url: "https://github.com/serenity-rs/serenity" },
  Poise: { url: "https://github.com/serenity-rs/poise" },
} as const satisfies Record<string, TechRef>;
export type BackendLibrary = keyof typeof BACKEND_LIBRARIES;

export const DATABASES = {
  PostgreSQL: { url: "https://www.postgresql.org/", icon: "dev-postgresql" },
  MySQL: { url: "https://www.mysql.com/" },
  SQLite3: { url: "https://www.sqlite.org/", icon: "dev-sqlite" },
} as const satisfies Record<string, TechRef>;
export type Database = keyof typeof DATABASES;

export const AI_INTEGRATIONS = {
  OpenAI: { url: "https://openai.com/", icon: OpenAI },
  Gemini: { url: "https://gemini.google.com/", icon: Gemini },
  Claude: { url: "https://anthropic.com/", icon: Claude },
  DeepSeek: { url: "https://www.deepseek.com/" },
  Mistral: { url: "https://mistral.ai/" },
  Ollama: { url: "https://ollama.com/" },
  "Hugging Face": { url: "https://huggingface.co/" },
  Replicate: { url: "https://replicate.com/" },
} as const satisfies Record<string, TechRef>;
export type AiIntegration = keyof typeof AI_INTEGRATIONS;

export const LANGUAGES = {
  TypeScript: {
    url: "https://www.typescriptlang.org/",
    icon: "dev-typescript",
  },
  Python: { url: "https://www.python.org/", icon: "dev-python" },
  Rust: { url: "https://www.rust-lang.org/", icon: "dev-rust" },
  Go: {
    url: "https://go.dev/",
    icon: "md-language_go",
    ariaLabel: "Go programming language",
  },
  "C++": { url: "https://isocpp.org/", icon: "dev-cplusplus" },
  C: { url: "https://www.open-std.org/jtc1/sc22/wg14/" },
  "C#": { url: "https://dotnet.microsoft.com/languages/csharp" },
  PHP: { url: "https://www.php.net/" },
  Ruby: { url: "https://www.ruby-lang.org/" },
  Java: { url: "https://www.java.com/" },
  Kotlin: { url: "https://kotlinlang.org/" },
  Lua: { url: "https://www.lua.org/" },
  Shell: { url: "https://www.gnu.org/software/bash/", icon: "md-console_line" },
} as const satisfies Record<string, TechRef>;
export type Languages = keyof typeof LANGUAGES;

export const LICENSES = {
  Unlicense: { url: "https://unlicense.org/" },
  MIT: { url: "https://opensource.org/licenses/MIT" },
  "Apache 2.0": { url: "https://www.apache.org/licenses/LICENSE-2.0" },
  "BSD 2-Clause": { url: "https://opensource.org/licenses/BSD-2-Clause" },
  "BSD 3-Clause": { url: "https://opensource.org/licenses/BSD-3-Clause" },
  GPLv2: { url: "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html" },
  GPLv3: { url: "https://www.gnu.org/licenses/gpl-3.0.html" },
  LGPL: { url: "https://www.gnu.org/licenses/lgpl-3.0.html" },
  MPL: { url: "https://www.mozilla.org/en-US/MPL/2.0/" },
} as const satisfies Record<string, TechRef>;
export type License = keyof typeof LICENSES;

const techUrls = {
  ...COMPUTE_SERVICES,
  ...STORAGE_SERVICES,
  ...DEVOPS_TOOLS,
  ...OBSERVABILITY_TOOLS,
  ...FRONTEND_LIBRARIES,
  ...BACKEND_LIBRARIES,
  ...DATABASES,
  ...AI_INTEGRATIONS,
  ...LANGUAGES,
  ...LICENSES,
} as const satisfies Record<string, TechRef>;

// Keep optional fields available to renderers while preserving every real key.
export const TECH_URLS: Record<keyof typeof techUrls, TechRef> = techUrls;
