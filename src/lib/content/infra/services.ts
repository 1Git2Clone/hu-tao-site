export const INFRA_DOMAIN = 'hu-tao.dev';

export interface Service {
	name: string;
	subdomain?: string;
	what: string;
	exposure: string;
	requiresAuth?: boolean;
}

export const PUBLIC_SERVICES: Service[] = [
	{
		name: 'Forgejo',
		subdomain: 'git',
		what: 'Git hosting with its own Actions runner. Mirrors of everything here.',
		exposure: 'Owns port 22 so clone URLs need no port, which moves the host sshd to 2222.'
	},
	{
		name: 'Uptime Kuma',
		subdomain: 'status',
		what: 'Status page for everything on this list.',
		exposure: 'An out-of-band probe watches it too, so a dead box still reports as dead.'
	},
	{
		name: 'Pages',
		subdomain: 'pages',
		what: 'Static sites built by Actions workflows and served straight off disk.',
		exposure: 'The directory layout is the URL. Nothing maps or rewrites.'
	},
	{
		name: 'SearXNG',
		subdomain: 'search',
		what: 'Metasearch with no accounts of its own.',
		exposure:
			'A cost-14 bcrypt is the only access control, so a rate limiter runs before it and answers 429 without paying the hash.',
		requiresAuth: true
	}
];

export const PRIVATE_SERVICES: Service[] = [
	{
		name: 'Mailserver',
		what: 'SMTP and IMAP with DKIM, DMARC, and a Roundcube webmail front end.',
		exposure: 'Public by necessity — an MX must be reachable — but it is my inbox, so no link.'
	},
	{
		name: 'Navidrome',
		what: 'Music streaming over my own library.',
		exposure: 'Bound to loopback and reached only through the reverse proxy.'
	},
	{
		name: 'Grafana + Tempo',
		what: 'Dashboards and OTLP traces.',
		exposure: 'Kept private by the firewall input chain, not by the bind address.'
	},
	{
		name: 'Dozzle',
		what: 'Live container logs.',
		exposure: 'Tailnet only.'
	},
	{
		name: 'PostgreSQL + pgbouncer',
		what: 'Shared database and connection pooler.',
		exposure: 'Host services rather than containers. Unix socket and loopback only.'
	},
	{
		name: 'Syncthing',
		what: 'File sync across my machines.',
		exposure: 'Tailnet only.'
	},
	{
		name: 'Serenity bot',
		what: 'A Rust Discord bot with a Redis cache that falls back to Discord on a miss.',
		exposure: 'Publishes nothing. It dials out to the Discord gateway.'
	},
	{
		name: 'Minecraft',
		what: 'A server for friends, quiesced weekly for a consistent backup.',
		exposure: 'Public on its own port. RCON stays on loopback.'
	}
];

export const INFRA_STACK = [
	{ name: 'NixOS', url: 'https://nixos.org/' },
	{ name: 'OpenTofu', url: 'https://opentofu.org/' },
	{ name: 'Caddy', url: 'https://caddyserver.com/' },
	{ name: 'nftables', url: 'https://netfilter.org/projects/nftables/' },
	{ name: 'sops-nix', url: 'https://github.com/Mic92/sops-nix' },
	{ name: 'restic', url: 'https://restic.net/' },
	{ name: 'Tailscale', url: 'https://tailscale.com/' },
	{ name: 'Docker', url: 'https://www.docker.com/' }
];
