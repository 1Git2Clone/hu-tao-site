import { assignDefaults, type ConstructorObject } from '$lib/utils/type-helpers';
import type * as CSS from 'csstype';
import { SvelteURL } from 'svelte/reactivity';

export type DevOps =
  | 'Docker'
  | 'Kubernetes'
  | 'GitHub Actions'
  ;
export type ObservabilityTool =
  | 'Prometheus'
  | 'Grafana'
  | 'OpenTelemetry'
  ;
export type FrontendLibrary =
  | 'React'
  | 'Svelte'
  | 'TailwindCSS'
  ;
export type BackendLibrary =
  | 'Axum'
  | 'Actix'
  | 'Tokio'
  | 'Serenity'
  | 'Poise'
  ;
export type Database =
  | 'PostgreSQL'
  | 'MySQL'
  | 'SQLite3'
  ;
export type AiIntegration =
  | 'OpenAI'
  | 'Claude'
  | 'DeepSeek'
  | 'Mistral'
  | 'Ollama'
  | 'Hugging Face'
  | 'Replicate'
  ;
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
  ;
export type License =
  | 'Unlicense'
  | 'MIT'
  | 'Apache 2.0'
  | 'BSD 2-Clause'
  | 'BSD 3-Clause'
  | 'GPLv2'
  | 'GPLv3'
  | 'LGPL'
  | 'MPL'
  ;
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
  ;

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
        cssObjectPosition: 'center 42%',
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
    tags: ['ai', 'backend'],
  }),
] as const satisfies Project[];
