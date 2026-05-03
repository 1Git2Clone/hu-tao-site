import { assignDefaults, type ConstructorObject } from '$lib/utils/type-helpers';
import type * as CSS from 'csstype';
import { SvelteURL } from 'svelte/reactivity';

type TechRef = { url: string; ariaLabel?: string };

export const COMPUTE_SERVICES: Record<string, TechRef> = {
	'AWS Lambda': { url: 'https://aws.amazon.com/lambda/' },
	'AWS EC2': { url: 'https://aws.amazon.com/ec2/' },
	'AWS ECS': { url: 'https://aws.amazon.com/ecs/' },
	'AWS Fargate': { url: 'https://aws.amazon.com/fargate/' }
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
	'GitHub Actions': { url: 'https://github.com/features/actions' }
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
export type Tag =
	| 'web'
	| 'ai'
	| 'systems'
	| 'tooling'
	| 'backend'
	| 'discord'
	| 'chatbot'
	| 'automation'
	| 'containerized'
	| 'database'
	| 'observability'
	| 'cli'
	| 'oss'
	| 'fintech'
	| 'aws';

export interface TechStack {
	compute?: ComputeService[];
	storage?: StorageService[];
	devops?: DevOps[];
	observability?: ObservabilityTool[];
	frontendLibraries?: FrontendLibrary[];
	backendLibraries?: BackendLibrary[];
	databases?: Database[];
	aiIntegrations?: AiIntegration[];
	languages: Languages[];
}

export class ProjectImageCSS {
	cssObjectFit: CSS.Property.ObjectFit = 'cover';
	cssObjectPosition: CSS.Property.ObjectPosition = 'center';
}

export class ProjectImage {
	source: string;
	css: ProjectImageCSS = new ProjectImageCSS();
	artistName: string;
	artistLink: SvelteURL;

	constructor(data: ConstructorObject<ProjectImage, 'css'>) {
		this.source = data.source;
		this.css = data.css ?? this.css;
		this.artistName = data.artistName;
		this.artistLink = data.artistLink;
	}
}

export class Project {
	title: string;
	image?: ProjectImage;
	sourceUrl?: SvelteURL;
	isPrivate?: boolean;

	techStack: TechStack;

	summary: string = '';
	description: string = '';
	licenses: License[] = [];
	tags: Tag[] = [];

	constructor(data: ConstructorObject<Project>) {
		this.title = data.title;
		this.techStack = data.techStack;

		assignDefaults(this, data);
	}
}

export const PROJECTS: Project[] = [
	new Project({
		title: 'Fintech Transaction Pipeline (Confidential)',
		isPrivate: true,
		techStack: {
			compute: ['AWS Lambda'],
			storage: ['Amazon S3'],
			languages: ['Go']
		},
		summary: `
A production fintech data pipeline for safely processing and analyzing transaction flows.
`.trim(),
		description: `
### Problem
Process sensitive transaction data for analytics while guaranteeing correctness under failure conditions.

### Solution
Built a greenfield AWS Lambda with NDJSON streaming to redact transaction data under memory constraints, feeding a consumer flow that analyzes, deletes, and preserves insights.

### Outcome
Enabled automated failure-rate analytics on production flows with 20x benchmark improvements while maintaining correctness, auditability, and data-handling compliance.
`.trim(),
		licenses: [],
		tags: ['fintech', 'backend', 'aws']
	}),
	new Project({
		title: 'AI Admin Tools (Confidential)',
		isPrivate: true,
		techStack: {
			compute: ['AWS Lambda'],
			storage: ['Amazon S3'],
			aiIntegrations: ['OpenAI', 'Gemini'],
			languages: ['Go', 'Python']
		},
		summary: `
Internal AI tooling for operational analytics, policy scanning, and document forensics.
`.trim(),
		description: `
### Problem
An internal admin system needed AI tools for analyzing failures, scanning policies, and inspecting documents without regex-only brittle workflows.

### Solution
Built AI-backed features for the Go dashboard: failure-rate insights, an AI policy scanner that handles SPAs, and document forensics using ExifTool, Tesseract, OpenCV, and Gemini computer vision.

### Outcome
Replaced fragile review workflows with auditable, reusable tools that help teams inspect operational issues, policy changes, and suspicious metadata faster inside production systems.
`.trim(),
		licenses: [],
		tags: ['ai', 'backend', 'aws', 'automation']
	}),
	new Project({
		title: 'Serenity Discord Bot',
		sourceUrl: new SvelteURL('https://github.com/1Git2Clone/serenity-bots'),
		techStack: {
			backendLibraries: ['Serenity', 'Tokio'],
			databases: ['PostgreSQL'],
			languages: ['Rust']
		},
		summary:
			'Asynchronous Discord bots with reactive database integrations and sub-100ms response times.',
		description: `
### Problem
Standard Discord bot frameworks trade off response time or require verbose async handling, making it hard to build responsive bots without boilerplate.

### Solution
Leveraged Serenity's event-driven architecture with Tokio for non-blocking I/O, PostgreSQL for state, and optimized task queuing to handle rapid user interactions.

### Outcome
Deployed bots achieving sub-100ms response times in production, handling thousands of concurrent users with minimal latency.
`.trim(),
		licenses: ['MIT'],
		tags: ['discord', 'backend', 'systems', 'chatbot', 'oss']
	})
];
