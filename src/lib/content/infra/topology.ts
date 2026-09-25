import type { Size } from '../../data/graph-layout';
import type { Graph, GraphLink, OverviewNode } from '../../types/infra-graph';

const link = (source: string, target: string): GraphLink => ({ source, target });

export const OVERVIEW: Graph<OverviewNode> = {
	nodes: [
		// The machine and what builds it.
		{
			id: 'internet',
			label: 'Internet',
			kind: 'public',
			description: 'You, probably.'
		},
		{
			id: 'cloudflare',
			label: 'Cloudflare',
			kind: 'infra',
			description: 'DNS for `hu-tao.dev`. The records are published by OpenTofu, not clicked in.'
		},
		{
			id: 'opentofu',
			label: 'OpenTofu',
			kind: 'infra',
			description:
				'Creates the Hetzner machine and its DNS records. Everything after first boot is the flake.'
		},
		{
			id: 'vps',
			label: 'Hetzner VPS',
			kind: 'infra',
			description:
				'One NixOS machine, described end to end in one flake: disks, firewall, secrets and every service.'
		},
		{
			id: 'sops-nix',
			label: 'sops-nix',
			kind: 'infra',
			description:
				'Secrets live encrypted in the repo and are decrypted on the machine at activation.'
		},
		{
			id: 'nftables',
			label: 'nftables',
			kind: 'infra',
			description: 'The firewall, declared in the flake like everything else.'
		},
		{
			id: 'restic',
			label: 'restic',
			kind: 'infra',
			description: 'Snapshots the data a rebuild from the flake cannot bring back.'
		},

		// Ways in.
		{
			id: 'caddy',
			label: 'Caddy',
			kind: 'infra',
			description: 'One reverse proxy and one certificate in front of every public service.'
		},
		{
			id: 'tailscale',
			label: 'Tailscale',
			kind: 'private',
			description: 'The private network. Dashboards, logs and sync answer only to my own machines.'
		},
		{
			id: 'discord',
			label: 'Discord',
			kind: 'public',
			description: 'Where the Serenity bot takes its commands from.'
		},

		// Public services.
		{
			id: 'forgejo',
			label: 'Forgejo',
			kind: 'public',
			description: 'Git hosting with its own Actions runner. Mirrors of everything here.'
		},
		{
			id: 'pages',
			label: 'Pages',
			kind: 'public',
			description: 'Static sites built by Forgejo Actions and served straight off disk.'
		},
		{
			id: 'uptime-kuma',
			label: 'Uptime Kuma',
			kind: 'public',
			description: 'A status page for every user-facing service. Ridicule accordingly.'
		},
		{
			id: 'roundcube',
			label: 'Roundcube',
			kind: 'public',
			description: 'Webmail for the mailserver.'
		},
		{
			id: 'mailserver',
			label: 'Mailserver',
			kind: 'infra',
			description: 'Mail for `hu-tao.dev`, at `smtp.hu-tao.dev`.'
		},
		{
			id: 'navidrome',
			label: 'Navidrome',
			kind: 'public',
			description: "Music streaming, because I got tired of paying for music I don't own."
		},
		{
			id: 'searxng',
			label: 'SearXNG',
			kind: 'public',
			description: 'Metasearch with no accounts of its own.'
		},
		{
			id: 'serenity',
			label: 'Serenity bot',
			kind: 'public',
			description: 'A Discord bot for fun interactions, written in Rust with poise and serenity.'
		},
		{
			id: 'minecraft',
			label: 'Minecraft',
			kind: 'public',
			description: 'A whitelisted server for me and my friends, at `mc.hu-tao.dev`.'
		},

		// Private services.
		{
			id: 'grafana',
			label: 'Grafana',
			kind: 'private',
			description: 'Dashboards, and OTLP traces through Tempo.'
		},
		{
			id: 'dozzle',
			label: 'Dozzle',
			kind: 'private',
			description: 'Live container logs for every service.'
		},
		{
			id: 'syncthing',
			label: 'Syncthing',
			kind: 'private',
			description: 'File sync across my machines.'
		},
		{
			id: 'postgres',
			label: 'PostgreSQL',
			kind: 'private',
			description: 'One shared database, pooled by pgbouncer.'
		},
		{
			id: 'redis',
			label: 'Redis',
			kind: 'private',
			description: "The Serenity bot's cache."
		}
	],
	links: [
		link('internet', 'cloudflare'),
		link('internet', 'caddy'),
		link('internet', 'minecraft'),
		link('opentofu', 'cloudflare'),
		link('opentofu', 'vps'),
		link('sops-nix', 'vps'),
		link('nftables', 'vps'),
		link('vps', 'caddy'),
		link('vps', 'tailscale'),
		link('vps', 'restic'),
		link('caddy', 'forgejo'),
		link('caddy', 'pages'),
		link('caddy', 'uptime-kuma'),
		link('caddy', 'roundcube'),
		link('caddy', 'navidrome'),
		link('caddy', 'searxng'),
		link('forgejo', 'pages'),
		link('roundcube', 'mailserver'),
		link('discord', 'serenity'),
		link('serenity', 'postgres'),
		link('serenity', 'redis'),
		link('serenity', 'grafana'),
		link('tailscale', 'grafana'),
		link('tailscale', 'dozzle'),
		link('tailscale', 'syncthing'),
		link('postgres', 'restic'),
		link('forgejo', 'restic')
	]
};

/** The viewBoxes the overview is drawn in: wide from `lg` up, tall below it. */
export const OVERVIEW_SIZES = {
	wide: { width: 900, height: 440 },
	tall: { width: 400, height: 800 }
} satisfies Record<string, Size>;
