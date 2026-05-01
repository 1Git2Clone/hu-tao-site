import { assignDefaults, type ConstructorObject } from '$lib/utils/type-helpers';
import type * as CSS from 'csstype';
import { SvelteURL } from 'svelte/reactivity';

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
	| 'oss';

export interface TechStack {
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
		title: 'Serenity Discord Bot',
		image: new ProjectImage({
			source: 'https://pbs.twimg.com/media/GeVpru3aAAAejzN?format=jpg&name=4096x4096',
			css: {
				cssObjectFit: 'cover',
				cssObjectPosition: 'center 42%'
			},
			artistName: 'じや',
			artistLink: new SvelteURL('https://x.com/G_Ya_170/status/1866014032018493942')
		}),
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
A discord bot with various interaction and utility commands as well as AI integration.
`.trim(),
		description: `
Some of the commands are:
| Command        | Description                                            |
| -------------- | ------------------------------------------------------ |
| \`/age\`       | Displays your or another user's account creation date. |
| \`/ai\`        | Yap with an AI!                                        |
| \`/cookie\`    | Give someone a cookie!                                 |
| \`/level\`     | Displays the user's level.                             |
| \`/toplevel\`  | Displays the levels for the top 9 users.               |
| \`/pat\`       | Pat someone.                                           |
| \`/hug\`       | Hug someone.                                           |
| \`/peek\`      | Send a peek GIF in the chat.                           |
| \`/avatar\`    | Get the avatar for someone.                            |
| \`/quote\`     | Send a Hu Tao quote!                                   |
| \`/uptime\`    | Displays the bot's current uptime.                     |

You can invite the bot to try it out using this
[\`OAuth link\`](https://discord.com/oauth2/authorize?client_id=1211325231659089920).
`.trim(),
		licenses: ['Apache 2.0'],
		tags: ['ai', 'backend']
	}),
	new Project({
		title: 'Markdown TOC Generator',
		sourceUrl: new SvelteURL('https://github.com/1Git2Clone/markdown-toc-generator'),
		techStack: {
			languages: ['Rust']
		},
		summary: `
CLI tool that generates and injects tables of contents into Markdown files.
`.trim(),
		description: `
Keeping a table of contents in sync with the actual heading structure of a Markdown file is the kind of task you don't notice until you have to do it manually across a dozen documentation files. One section rename and the TOC is silently wrong — no linter catches it, no compiler errors.

This tool parses the document at the AST level — not with fragile regex — building a proper nested tree from the heading hierarchy. It then injects or updates a TOC at a configurable marker location in the file, handling edge cases like headings inside code blocks, multi-line headings, and files with existing TOCs that need replacement. Written in Rust because a documentation tool should complete faster than the blink of an eye, making it practical to run on save without breaking flow.
`.trim(),
		licenses: ['MIT'],
		tags: ['cli', 'tooling']
	}),
	new Project({
		title: 'Dotfiles',
		sourceUrl: new SvelteURL('https://github.com/1Git2Clone/dotfiles'),
		techStack: {
			devops: ['Docker'],
			languages: ['Shell', 'Lua']
		},
		summary: `
Fully configured Arch Linux desktop environment with a red-themed Neovim, kitty, and tmux setup.
`.trim(),
		description: `
These dotfiles have been in active development since late 2023, tracking the evolution of my terminal workflow through real usage rather than theoretical ideals. The environment moved from Hyprland to i3wm and back to Hyprland across different machines — each transition driven by actual productivity needs (tiling behavior under multi-monitor configurations, compositor stability with specific graphics stacks) rather than chasing novelty.

The Neovim configuration grew substantial enough to warrant its own dedicated repository — a sign that the editor setup stopped being "a few config files" and became a serious, opinionated development environment. The entire stack — Neovim, kitty, tmux, window manager, shell prompts — is tuned for a cohesive red-accented aesthetic, because visual consistency across tools reduces the cognitive cost of context switching. Every color, keybinding, and plugin choice has a rationale grounded in actual daily use.
`.trim(),
		licenses: ['Unlicense'],
		tags: ['systems', 'tooling']
	}),
	new Project({
		title: 'Hunger Games Simulator',
		techStack: {
			devops: ['Docker'],
			frontendLibraries: ['Svelte'],
			databases: ['PostgreSQL'],
			languages: ['Go']
		},
		summary: `
Real-time multiplayer simulator with Discord OAuth2, WebSocket sync, JWT auth, and testcontainers integration testing.
`.trim(),
		description: `
Real-time multiplayer games present engineering problems that typical web applications don't: synchronizing authoritative game state across dozens of WebSocket connections, handling mid-game disconnects without corrupting the session, and designing an event protocol expressive enough for complex game actions yet compact enough for latency-sensitive delivery.

The Go backend runs a centralized game loop that processes player actions, enforces game rules, and broadcasts state updates through WebSocket connections authenticated via Discord OAuth2 and JWT. SvelteKit handles the real-time frontend, subscribing to server events and rendering state transitions as they happen. The integration testing strategy uses testcontainers to spin up PostgreSQL instances alongside the Go server, verifying the full multiplayer flow — from WebSocket handshake through game completion — in isolated, reproducible environments. Still in active development, but the architecture is designed for the hard parts: state consistency under concurrent access, graceful recovery from dropped connections, and clean separation between game logic and transport layer.
`.trim(),
		licenses: ['MIT'],
		tags: ['backend', 'web', 'containerized', 'database']
	})
] as const satisfies Project[];
