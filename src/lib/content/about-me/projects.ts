import { assignDefaults, type ConstructorObject } from '$lib/utils/type-helpers';
import type * as CSS from 'csstype';
import { SvelteURL } from 'svelte/reactivity';

export type ComputeService = 'AWS Lambda' | 'AWS EC2' | 'AWS ECS' | 'AWS Fargate';
export type StorageService = 'Amazon S3' | 'Amazon EBS' | 'Amazon EFS';
export type DevOps = 'Docker' | 'Kubernetes' | 'GitHub Actions';
export type ObservabilityTool = 'Prometheus' | 'Grafana' | 'OpenTelemetry';
export type FrontendLibrary = 'React' | 'Svelte' | 'TailwindCSS';
export type BackendLibrary = 'Axum' | 'Actix' | 'Tokio' | 'Serenity' | 'Poise';
export type Database = 'PostgreSQL' | 'MySQL' | 'SQLite3';
export type AiIntegration =
	| 'OpenAI'
	| 'Claude'
	| 'DeepSeek'
	| 'Mistral'
	| 'Ollama'
	| 'Hugging Face'
	| 'Replicate';
export type Languages =
	| 'TypeScript'
	| 'Python'
	| 'Rust'
	| 'Go'
	| 'C++'
	| 'C'
	| 'C#'
	| 'PHP'
	| 'Ruby'
	| 'Java'
	| 'Kotlin'
	| 'Lua'
	| 'Shell';
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
			compute: ['AWS Lambda'],
			storage: ['Amazon S3'],
			languages: ['Go']
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
			languages: ['Rust']
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
	}),
] as const satisfies Project[];
