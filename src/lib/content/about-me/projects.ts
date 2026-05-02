import { assignDefaults, type ConstructorObject } from '$lib/utils/type-helpers';
import type * as CSS from 'csstype';
import { SvelteURL } from 'svelte/reactivity';

export type ComputeService =
	| readonly ['AWS Lambda', 'https://aws.amazon.com/lambda/']
	| readonly ['AWS EC2', 'https://aws.amazon.com/ec2/']
	| readonly ['AWS ECS', 'https://aws.amazon.com/ecs/']
	| readonly ['AWS Fargate', 'https://aws.amazon.com/fargate/'];
export type StorageService =
	| readonly ['Amazon S3', 'https://aws.amazon.com/s3/']
	| readonly ['Amazon EBS', 'https://aws.amazon.com/ebs/']
	| readonly ['Amazon EFS', 'https://aws.amazon.com/efs/'];
export type DevOps =
	| readonly ['Docker', 'https://www.docker.com/']
	| readonly ['Kubernetes', 'https://kubernetes.io/']
	| readonly ['GitHub Actions', 'https://github.com/features/actions'];
export type ObservabilityTool =
	| readonly ['Prometheus', 'https://prometheus.io/']
	| readonly ['Grafana', 'https://grafana.com/']
	| readonly ['OpenTelemetry', 'https://opentelemetry.io/'];
export type FrontendLibrary =
	| readonly ['React', 'https://react.dev/']
	| readonly ['Svelte', 'https://svelte.dev/']
	| readonly ['TailwindCSS', 'https://tailwindcss.com/'];
export type BackendLibrary =
	| readonly ['Axum', 'https://github.com/tokio-rs/axum']
	| readonly ['Actix', 'https://actix.rs/']
	| readonly ['Tokio', 'https://tokio.rs/']
	| readonly ['Serenity', 'https://github.com/serenity-rs/serenity']
	| readonly ['Poise', 'https://github.com/serenity-rs/poise'];
export type Database =
	| readonly ['PostgreSQL', 'https://www.postgresql.org/']
	| readonly ['MySQL', 'https://www.mysql.com/']
	| readonly ['SQLite3', 'https://www.sqlite.org/'];
export type AiIntegration =
	| readonly ['OpenAI', 'https://openai.com/']
	| readonly ['Claude', 'https://anthropic.com/']
	| readonly ['DeepSeek', 'https://www.deepseek.com/']
	| readonly ['Mistral', 'https://mistral.ai/']
	| readonly ['Ollama', 'https://ollama.com/']
	| readonly ['Hugging Face', 'https://huggingface.co/']
	| readonly ['Replicate', 'https://replicate.com/'];
export type Languages =
	| readonly ['TypeScript', 'https://www.typescriptlang.org/']
	| readonly ['Python', 'https://www.python.org/']
	| readonly ['Rust', 'https://www.rust-lang.org/']
	| readonly ['Go', 'https://go.dev/']
	| readonly ['C++', 'https://isocpp.org/']
	| readonly ['C', 'https://www.open-std.org/jtc1/sc22/wg14/']
	| readonly ['C#', 'https://dotnet.microsoft.com/languages/csharp']
	| readonly ['PHP', 'https://www.php.net/']
	| readonly ['Ruby', 'https://www.ruby-lang.org/']
	| readonly ['Java', 'https://www.java.com/']
	| readonly ['Kotlin', 'https://kotlinlang.org/']
	| readonly ['Lua', 'https://www.lua.org/']
	| readonly ['Shell', 'https://www.gnu.org/software/bash/'];
export type License =
	| 'Unlicense'
	| 'MIT'
	| 'Apache 2.0'
	| 'BSD 2-Clause'
	| 'BSD 3-Clause'
	| 'GPLv2'
	| 'GPLv3'
	| 'LGPL'
	| 'MPL';
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
			compute: [['AWS Lambda', 'https://aws.amazon.com/lambda/'] as const],
			storage: [['Amazon S3', 'https://aws.amazon.com/s3/'] as const],
			languages: [['Go', 'https://go.dev/'] as const]
		},
		summary: `
A production fintech data pipeline for safely processing and analyzing transaction flows.
`.trim(),
		description: `
**Problem:** Needed to safely process sensitive transaction data for analytics while ensuring correctness and reliability under failure conditions.

**Solution:** Designed and built a greenfield AWS ingestion pipeline using NDJSON streaming to process and redact transaction data under Lambda memory constraints. The system batches transaction flows into S3 and feeds a downstream AI ingestion pipeline for failure-rate analytics.

**Outcome:** Enabled automated failure-rate analytics on live transaction flows. Improved benchmark performance significantly (up to 20x in tests) while maintaining strict correctness requirements for financial data handling.
`.trim(),
		licenses: [],
		tags: ['fintech', 'backend', 'aws']
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
			devops: [
				['Docker', 'https://www.docker.com/'] as const,
				['GitHub Actions', 'https://github.com/features/actions'] as const
			] as DevOps[],
			observability: [
				['OpenTelemetry', 'https://opentelemetry.io/'] as const
			] as ObservabilityTool[],
			backendLibraries: [
				['Tokio', 'https://tokio.rs/'] as const,
				['Serenity', 'https://github.com/serenity-rs/serenity'] as const,
				['Poise', 'https://github.com/serenity-rs/poise'] as const
			] as BackendLibrary[],
			databases: [['PostgreSQL', 'https://www.postgresql.org/'] as const] as Database[],
			aiIntegrations: [['Ollama', 'https://ollama.com/'] as const] as AiIntegration[],
			languages: [['Rust', 'https://www.rust-lang.org/'] as const] as Languages[]
		},
		summary: `
A production Discord bot built in Rust with AI integration, persistent user data, and full observability.
`.trim(),
		description: `
**Problem:** Needed a production Discord bot with AI integration, persistent user data, and observability without the Node.js ecosystem.

**Solution:** Built in Rust using Serenity, Poise, and Tokio, backed by PostgreSQL, Docker, and OpenTelemetry.

**Outcome:** Shipped with slash commands, a leveling system, AI chat integration, and sub-100ms response times. Self-hosted by multiple communities. Apache 2.0, self-hostable.
`.trim(),
		licenses: ['Apache 2.0'],
		tags: ['ai', 'backend']
	}),
	new Project({
		title: 'taboc — Table of Contents CLI',
		sourceUrl: new SvelteURL('https://github.com/1Git2Clone/taboc'),
		techStack: {
			languages: [['Rust', 'https://www.rust-lang.org/'] as const] as Languages[]
		},
		summary: `
A zero-dependency Rust CLI for generating and injecting Markdown tables of contents.
`.trim(),
		description: `
**Problem:** No reliable CLI tool existed to generate and inject Markdown tables of contents without external dependencies.

**Solution:** Built a zero-dependency Rust CLI that parses heading structure and writes TOC blocks in-place.

**Outcome:** Installable via \`cargo install taboc\`. Used in documentation workflows.
`.trim(),
		licenses: ['MIT'],
		tags: ['cli', 'tooling']
	})
] as const satisfies Project[];
