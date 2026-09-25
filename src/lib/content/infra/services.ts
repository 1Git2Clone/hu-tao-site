// Markdown, rendered by `marked` on the server. A table cell holds one line of
// inline markdown: `<br>` breaks it, and a quote is italics rather than `>`.

export const PUBLIC_SERVICES = `
| Service                                                                                     | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Forgejo**](https://git.hu-tao.dev)<br>git.hu-tao.dev                                     | Git hosting with its own Actions runner. Mirrors of everything here. *Because GitHub is closed-source.*                                                                                                                                                                                                                                                                                                                                                                 |
| [**Uptime Kuma**](https://status.hu-tao.dev/status/all)<br>status.hu-tao.dev                | A status page for all my user-facing services. *So you can ridicule me when I don't fulfill my SLAs.*                                                                                                                                                                                                                                                                                                                                                                   |
| [**Roundcube Mail**](https://mail.hu-tao.dev)<br>mail.hu-tao.dev                            | Web-based mailbox viewer for my mailserver at \`smtp.hu-tao.dev\`.                                                                                                                                                                                                                                                                                                                                                                                                      |
| [**Navidrome**](https://music.hu-tao.dev)<br>music.hu-tao.dev                               | Because I got tired of paying for music I don't own.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [**Pages**](https://pages.hu-tao.dev/hutao/compress)<br>pages.hu-tao.dev                    | Static sites built by Actions workflows and served straight off disk. The linked page is a fork from [\`compress.lol\`](https://github.com/sowahq/compress.lol), a web-based video compressor running ffmpeg entirely on the frontend using WebAssembly.                                                                                                                                                                                                                |
| [**SearXNG**](https://search.hu-tao.dev)<br>search.hu-tao.dev                               | Metasearch with no accounts of its own. **PS:** Make sure to [star the repo](https://github.com/searxng/searxng).                                                                                                                                                                                                                                                                                                                                                       |
| [**Serenity bot**](https://git.hu-tao.dev/hutao/serenity-discord-bot)<br>git.hu-tao.dev     | A fun interactions Discord bot written in Rust ([poise](https://github.com/serenity-rs/poise) & [serenity](https://github.com/serenity-rs/serenity)) using Postgres, Redis, Grafana & Tempo. You can check it out at [@NoPengoo](https://www.youtube.com/@nopengoo)'s [Discord server](https://discord.gg/bgbDv4vRzq). Or register it under your server or Discord account using [this OAuth2 URL](https://discord.com/oauth2/authorize?client_id=1211325231659089920). |
| [**Minecraft**](minecraft://?addExternalServer=hu-tao.dev%7Cmc.hu-tao.dev)<br>mc.hu-tao.dev | A minecraft server for me and my friends. **Note:** You need to be in the whitelisted players to join.                                                                                                                                                                                                                                                                                                                                                                  |
`;

export const PRIVATE_SERVICES = `
| Service                                                                                | What it is                               |
| -------------------------------------------------------------------------------------- | ---------------------------------------- |
| [**Grafana + Tempo**](https://grafana.hu-tao.dev)<br>grafana.hu-tao.dev • Tailnet only | Dashboards and OTLP traces.              |
| [**Dozzle**](https://dozzle.hu-tao.dev)<br>dozzle.hu-tao.dev  • Tailnet only           | Live container logs for all my services. |
| [**Syncthing**](https://syncthing.hu-tao.dev)<br>syncthing.hu-tao.dev  • Tailnet only  | File sync across my machines.            |
| **PostgreSQL + pgbouncer**                                                             | Shared database and connection pooler.   |
`;

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
