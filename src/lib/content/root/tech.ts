type TechRef = { url: string; ariaLabel?: string };

export const COMPUTE_SERVICES: Record<string, TechRef> = {
	'AWS Lambda': { url: 'https://aws.amazon.com/lambda/' },
	'AWS EC2': { url: 'https://aws.amazon.com/ec2/' },
	'AWS ECS': { url: 'https://aws.amazon.com/ecs/' },
	'Hetzner Cloud': { url: 'https://www.hetzner.com/cloud/' },
	Scaleway: { url: 'https://www.scaleway.com/' }
} as const;
export type ComputeService = keyof typeof COMPUTE_SERVICES;

export const STORAGE_SERVICES: Record<string, TechRef> = {
	'Amazon S3': { url: 'https://aws.amazon.com/s3/' },
	'Amazon EBS': { url: 'https://aws.amazon.com/ebs/' },
	'Amazon EFS': { url: 'https://aws.amazon.com/efs/' }
} as const;
export type StorageService = keyof typeof STORAGE_SERVICES;

export const DEVOPS_TOOLS: Record<string, TechRef> = {
	Docker: { url: 'https://www.docker.com/' },
	Kubernetes: { url: 'https://kubernetes.io/' },
	'GitHub Actions': { url: 'https://github.com/features/actions' },
	Nix: { url: 'https://nixos.org/' },
	OpenTofu: { url: 'https://opentofu.org/' },
	Caddy: { url: 'https://caddyserver.com/' }
} as const;
export type DevOps = keyof typeof DEVOPS_TOOLS;

export const OBSERVABILITY_TOOLS: Record<string, TechRef> = {
	Prometheus: { url: 'https://prometheus.io/' },
	Grafana: { url: 'https://grafana.com/' },
	OpenTelemetry: { url: 'https://opentelemetry.io/' }
} as const;
export type ObservabilityTool = keyof typeof OBSERVABILITY_TOOLS;

export const FRONTEND_LIBRARIES: Record<string, TechRef> = {
	React: { url: 'https://react.dev/' },
	Svelte: { url: 'https://svelte.dev/' },
	TailwindCSS: { url: 'https://tailwindcss.com/' }
} as const;
export type FrontendLibrary = keyof typeof FRONTEND_LIBRARIES;

export const BACKEND_LIBRARIES: Record<string, TechRef> = {
	Axum: { url: 'https://github.com/tokio-rs/axum' },
	Actix: { url: 'https://actix.rs/' },
	Tokio: { url: 'https://tokio.rs/' },
	Serenity: { url: 'https://github.com/serenity-rs/serenity' },
	Poise: { url: 'https://github.com/serenity-rs/poise' }
} as const;
export type BackendLibrary = keyof typeof BACKEND_LIBRARIES;

export const DATABASES: Record<string, TechRef> = {
	PostgreSQL: { url: 'https://www.postgresql.org/' },
	MySQL: { url: 'https://www.mysql.com/' },
	SQLite3: { url: 'https://www.sqlite.org/' }
} as const;
export type Database = keyof typeof DATABASES;

export const AI_INTEGRATIONS: Record<string, TechRef> = {
	OpenAI: { url: 'https://openai.com/' },
	Gemini: { url: 'https://gemini.google.com/' },
	Claude: { url: 'https://anthropic.com/' },
	DeepSeek: { url: 'https://www.deepseek.com/' },
	Mistral: { url: 'https://mistral.ai/' },
	Ollama: { url: 'https://ollama.com/' },
	'Hugging Face': { url: 'https://huggingface.co/' },
	Replicate: { url: 'https://replicate.com/' }
} as const;
export type AiIntegration = keyof typeof AI_INTEGRATIONS;

export const LANGUAGES: Record<string, TechRef> = {
	TypeScript: { url: 'https://www.typescriptlang.org/' },
	Python: { url: 'https://www.python.org/' },
	Rust: { url: 'https://www.rust-lang.org/' },
	Go: { url: 'https://go.dev/', ariaLabel: 'Go programming language' },
	'C++': { url: 'https://isocpp.org/' },
	C: { url: 'https://www.open-std.org/jtc1/sc22/wg14/' },
	'C#': { url: 'https://dotnet.microsoft.com/languages/csharp' },
	PHP: { url: 'https://www.php.net/' },
	Ruby: { url: 'https://www.ruby-lang.org/' },
	Java: { url: 'https://www.java.com/' },
	Kotlin: { url: 'https://kotlinlang.org/' },
	Lua: { url: 'https://www.lua.org/' },
	Shell: { url: 'https://www.gnu.org/software/bash/' }
} as const;
export type Languages = keyof typeof LANGUAGES;

export const LICENSES: Record<string, TechRef> = {
	Unlicense: { url: 'https://unlicense.org/' },
	MIT: { url: 'https://opensource.org/licenses/MIT' },
	'Apache 2.0': { url: 'https://www.apache.org/licenses/LICENSE-2.0' },
	'BSD 2-Clause': { url: 'https://opensource.org/licenses/BSD-2-Clause' },
	'BSD 3-Clause': { url: 'https://opensource.org/licenses/BSD-3-Clause' },
	GPLv2: { url: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html' },
	GPLv3: { url: 'https://www.gnu.org/licenses/gpl-3.0.html' },
	LGPL: { url: 'https://www.gnu.org/licenses/lgpl-3.0.html' },
	MPL: { url: 'https://www.mozilla.org/en-US/MPL/2.0/' }
} as const;
export type License = keyof typeof LICENSES;

export const TECH_URLS = {
	...COMPUTE_SERVICES,
	...STORAGE_SERVICES,
	...DEVOPS_TOOLS,
	...OBSERVABILITY_TOOLS,
	...FRONTEND_LIBRARIES,
	...BACKEND_LIBRARIES,
	...DATABASES,
	...AI_INTEGRATIONS,
	...LANGUAGES,
	...LICENSES
} as const;
