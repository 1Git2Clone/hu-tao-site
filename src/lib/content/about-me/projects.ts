import { assignDefaults, type ConstructorObject } from '$lib/utils/type-helpers';
import type * as CSS from 'csstype';
import { SvelteURL } from 'svelte/reactivity';

export const COMPUTE_SERVICES = {
	'AWS Lambda': 'https://aws.amazon.com/lambda/',
	'AWS EC2': 'https://aws.amazon.com/ec2/',
	'AWS ECS': 'https://aws.amazon.com/ecs/',
	'AWS Fargate': 'https://aws.amazon.com/fargate/'
} as const;
export type ComputeService = keyof typeof COMPUTE_SERVICES;

export const STORAGE_SERVICES = {
	'Amazon S3': 'https://aws.amazon.com/s3/',
	'Amazon EBS': 'https://aws.amazon.com/ebs/',
	'Amazon EFS': 'https://aws.amazon.com/efs/'
} as const;
export type StorageService = keyof typeof STORAGE_SERVICES;

export const DEVOPS_TOOLS = {
	Docker: 'https://www.docker.com/',
	Kubernetes: 'https://kubernetes.io/',
	'GitHub Actions': 'https://github.com/features/actions'
} as const;
export type DevOps = keyof typeof DEVOPS_TOOLS;

export const OBSERVABILITY_TOOLS = {
	Prometheus: 'https://prometheus.io/',
	Grafana: 'https://grafana.com/',
	OpenTelemetry: 'https://opentelemetry.io/'
} as const;
export type ObservabilityTool = keyof typeof OBSERVABILITY_TOOLS;

export const FRONTEND_LIBRARIES = {
	React: 'https://react.dev/',
	Svelte: 'https://svelte.dev/',
	TailwindCSS: 'https://tailwindcss.com/'
} as const;
export type FrontendLibrary = keyof typeof FRONTEND_LIBRARIES;

export const BACKEND_LIBRARIES = {
	Axum: 'https://github.com/tokio-rs/axum',
	Actix: 'https://actix.rs/',
	Tokio: 'https://tokio.rs/',
	Serenity: 'https://github.com/serenity-rs/serenity',
	Poise: 'https://github.com/serenity-rs/poise'
} as const;
export type BackendLibrary = keyof typeof BACKEND_LIBRARIES;

export const DATABASES = {
	PostgreSQL: 'https://www.postgresql.org/',
	MySQL: 'https://www.mysql.com/',
	SQLite3: 'https://www.sqlite.org/'
} as const;
export type Database = keyof typeof DATABASES;

export const AI_INTEGRATIONS = {
	OpenAI: 'https://openai.com/',
	Gemini: 'https://gemini.google.com/',
	Claude: 'https://anthropic.com/',
	DeepSeek: 'https://www.deepseek.com/',
	Mistral: 'https://mistral.ai/',
	Ollama: 'https://ollama.com/',
	'Hugging Face': 'https://huggingface.co/',
	Replicate: 'https://replicate.com/'
} as const;
export type AiIntegration = keyof typeof AI_INTEGRATIONS;

export const LANGUAGES = {
	TypeScript: 'https://www.typescriptlang.org/',
	Python: 'https://www.python.org/',
	Rust: 'https://www.rust-lang.org/',
	Go: 'https://go.dev/',
	'C++': 'https://isocpp.org/',
	C: 'https://www.open-std.org/jtc1/sc22/wg14/',
	'C#': 'https://dotnet.microsoft.com/languages/csharp',
	PHP: 'https://www.php.net/',
	Ruby: 'https://www.ruby-lang.org/',
	Java: 'https://www.java.com/',
	Kotlin: 'https://kotlinlang.org/',
	Lua: 'https://www.lua.org/',
	Shell: 'https://www.gnu.org/software/bash/'
} as const;
export type Languages = keyof typeof LANGUAGES;

export const LICENSES = {
	Unlicense: 'https://unlicense.org/',
	MIT: 'https://opensource.org/licenses/MIT',
	'Apache 2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
	'BSD 2-Clause': 'https://opensource.org/licenses/BSD-2-Clause',
	'BSD 3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
	GPLv2: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
	GPLv3: 'https://www.gnu.org/licenses/gpl-3.0.html',
	LGPL: 'https://www.gnu.org/licenses/lgpl-3.0.html',
	MPL: 'https://www.mozilla.org/en-US/MPL/2.0/'
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
**Problem:** Process sensitive transaction data for analytics while guaranteeing correctness under failure conditions.

**Solution:** Built a greenfield AWS Lambda with NDJSON streaming to redact transaction data under memory constraints, feeding a consumer flow that analyzes, deletes, and preserves insights.

**Outcome:** Enabled automated failure-rate analytics on production flows with 20x benchmark improvements while maintaining correctness, auditability, and data-handling compliance.
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
**Problem:** An internal admin system needed AI tools for analyzing failures, scanning policies, and inspecting documents without regex-only brittle workflows.

**Solution:** Built AI-backed features for the Go dashboard: failure-rate insights, an AI policy scanner that handles SPAs, and document forensics using ExifTool, Tesseract, OpenCV, and Gemini computer vision.

**Outcome:** Replaced fragile review workflows with auditable, reusable tools that help teams inspect operational issues, policy changes, and suspicious metadata faster inside production systems.
`.trim(),
		licenses: [],
		tags: ['ai', 'automation', 'fintech']
	}),
	new Project({
		title: 'Serenity Discord Bot',
		// image: new ProjectImage({
		//   source: 'https://pbs.twimg.com/media/GeVpru3aAAAejzN?format=jpg&name=4096x4096',
		//   css: {
		//     cssObjectFit: 'cover',
		//     cssObjectPosition: 'center 42%',
		//   },
		//   artistName: 'じや',
		//   artistLink: new SvelteURL('https://x.com/G_Ya_170/status/1866014032018493942')
		// }),
		sourceUrl: new SvelteURL('https://github.com/1Git2Clone/serenity-discord-bot'),
		techStack: {
			devops: ['Docker', 'GitHub Actions'],
			observability: ['OpenTelemetry'],
			backendLibraries: ['Tokio', 'Serenity', 'Poise'],
			databases: ['PostgreSQL'],
			aiIntegrations: ['Ollama'],
			languages: ['Rust']
		},
		summary: `
A production Discord bot built in Rust with AI integration, persistent user data, and full observability.
`.trim(),
		description: `
**Problem:** Build a production Discord bot with AI integration, persistent data, and observability without Node.js.

**Solution:** Built with Rust using Serenity, Poise, and Tokio, backed by PostgreSQL, Docker, and OpenTelemetry for full observability.

**Outcome:** Shipped with slash commands, leveling system, AI chat, and sub-100ms response times. Self-hosted by multiple communities. Apache 2.0 licensed.
`.trim(),
		licenses: ['Apache 2.0'],
		tags: ['ai', 'backend']
	})
	// 	new Project({
	// 		title: 'taboc — Table of Contents CLI',
	// 		sourceUrl: new SvelteURL('https://github.com/1Git2Clone/taboc'),
	// 		techStack: {
	// 			languages: ['Rust']
	// 		},
	// 		summary: `
	// A zero-dependency Rust CLI for generating and injecting Markdown tables of contents.
	// `.trim(),
	// 		description: `
	// **Problem:** No reliable CLI tool existed to generate and inject Markdown tables of contents without external dependencies.
	//
	// **Solution:** Built a zero-dependency Rust CLI that parses heading structure and writes TOC blocks in-place.
	//
	// **Outcome:** Installable via \`cargo install taboc\`. Used in documentation workflows.
	// `.trim(),
	// 		licenses: ['MIT'],
	// 		tags: ['cli', 'tooling']
	// 	})
] as const satisfies Project[];
