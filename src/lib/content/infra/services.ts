export interface Service {
	name: string;
	displayPage?: string;
	page?: string;
	description: string;
}

export const PUBLIC_SERVICES: Service[] = [
	{
		name: 'Forgejo',
		page: 'https://git.hu-tao.dev',
		description: `
Git hosting with its own Actions runner. Mirrors of everything here.
> Because GitHub is closed-source.
`
	},
	{
		name: 'Uptime Kuma',
		page: 'https://status.hu-tao.dev/status/all',
		description: `
A status page for all my user-facing services.

> *So you can ridicule me when I don't fulfill my SLAs.*
`
	},
	{
		name: 'Roundcube Mail',
		page: 'https://mail.hu-tao.dev',
		description: 'Web-based mailbox viewer for my mailserver at `smtp.hu-tao.dev`.'
	},
	{
		name: 'Navidrome',
		page: 'https://music.hu-tao.dev',
		description: `
Because I got tired of paying for music I don't own.
`
	},
	{
		name: 'Pages',
		page: 'https://pages.hu-tao.dev/hutao/compress',
		description: `Static sites built by Actions workflows and served straight off
disk. The linked page is a fork from
[\`compress.lol\`](https://github.com/sowahq/compress.lol), a web-based video
compressor running ffmpeg entirely on the frontend using WebAssembly.`
	},
	{
		name: 'SearXNG',
		page: 'https://search.hu-tao.dev',
		description: `
Metasearch with no accounts of its own.
> **PS:** Make sure to [star the repo](https://github.com/searxng/searxng).
`
	},
	{
		name: 'Serenity bot',
		page: 'https://git.hu-tao.dev/hutao/serenity-discord-bot',
		description: `
A fun interactions Discord bot written in Rust
([poise](https://github.com/serenity-rs/poise) &
[serenity](https://github.com/serenity-rs/serenity)) using Postgres, Redis,
Grafana & Tempo.

You can check it out at [@NoPengoo](https://www.youtube.com/@nopengoo)'s
[Discord server](https://discord.gg/bgbDv4vRzq). Or register it under your
server or Discord account using
[this OAuth2 URL](https://discord.com/oauth2/authorize?client_id=1211325231659089920).
`
	},
	{
		name: 'Minecraft',
		displayPage: 'mc.hu-tao.dev',
		page: 'minecraft://?addExternalServer=hu-tao.dev%7Cmc.hu-tao.dev',
		description: `
A minecraft server for me and my friends.

> **Note**: You need to be in the whitelisted players to join.
`
	}
];

export const PRIVATE_SERVICES: Service[] = [
	{
		name: 'Grafana + Tempo',
		page: 'https://grafana.hu-tao.dev',
		displayPage: 'grafana.hu-tao.dev • Tailnet only',
		description: 'Dashboards and OTLP traces.'
	},
	{
		name: 'Dozzle',
		page: 'https://dozzle.hu-tao.dev',
		displayPage: 'dozzle.hu-tao.dev  • Tailnet only',
		description: 'Live container logs for all my services.'
	},
	{
		name: 'Syncthing',
		page: 'https://syncthing.hu-tao.dev',
		displayPage: 'syncthing.hu-tao.dev  • Tailnet only',
		description: 'File sync across my machines.'
	},
	{
		name: 'PostgreSQL + pgbouncer',
		description: 'Shared database and connection pooler.'
	}
];

export const INFRA_STACK = [
	{ name: 'NixOS', url: 'https://nixos.org/' },
	{ name: 'OpenTofu', url: 'https://opentofu.org/' },
	{ name: 'Hetzner', url: 'https://www.hetzner.com/cloud/' },
	{ name: 'Cloudflare', url: 'https://www.cloudflare.com/' },
	{ name: 'Caddy', url: 'https://caddyserver.com/' },
	{ name: 'nftables', url: 'https://netfilter.org/projects/nftables/' },
	{ name: 'sops-nix', url: 'https://github.com/Mic92/sops-nix' },
	{ name: 'restic', url: 'https://restic.net/' },
	{ name: 'Tailscale', url: 'https://tailscale.com/' },
	{ name: 'Docker', url: 'https://www.docker.com/' }
];
