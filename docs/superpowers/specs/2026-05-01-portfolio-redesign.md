# Portfolio Redesign — Professional Reorientation

## Overview

Reorient 1Git2Clone's personal site (hu-tao.dev) toward also serving as a
professional portfolio that can be linked from freelance profiles, without
losing its personal character.

## Files to Modify

| File                               | Action                                                                |
| ---------------------------------- | --------------------------------------------------------------------- |
| `src/lib/utils/consts.ts`          | Add `EMAIL` constant                                                  |
| `src/routes/about-me/+page.svelte` | Replace lorem ipsum bio, add portfolio projects section, add hire CTA |
| `src/routes/+page.svelte`          | Replace Linux journey with professional intro                         |
| `src/routes/journey/+page.svelte`  | **New** — hosts the HistoryTree component                             |

---

## 1. Constants (`$lib/utils/consts.ts`)

Add one new constant:

```ts
export const EMAIL = 'ivankirilov640@gmail.com';
```

No `UPWORK_URL` — the site should not mention Upwork. It is a portfolio piece
in its own right and a frontpage for Ivan's real projects.

---

## 2. About Me Page (`/about-me`)

### 2a. Bio Section

Replace the existing bio section content (lorem ipsum + old subtitle) with:

- **Subtitle**: `"Backend Engineer | Go & Rust | Fintech & Developer Tooling"`
- **Body**: The full bio text from the requirements (4 paragraphs — fintech
  infrastructure, ownership/value, open-source, availability).
- **Contact line**: Append a line at the bottom:
  > "Available remotely — [email link]"

Keep the existing section wrapper class:
`border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert`

### 2b. Portfolio Projects Section

A new section below the bio, using the same bordered-section pattern.

Each project is a card showing:

- **Name**: linked to GitHub repo (or `TODO` comment if unknown)
- **Description**: one-sentence problem statement
- **Tech stack tags**: rendered as small bordered spans
- **Metric**: optional, shown if relevant

Four projects:

| Project                | URL                                                  | Description                                                                                   | Tags                                                            | Metric |
| ---------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------ |
| Serenity Discord Bot   | `https://github.com/1Git2Clone/serenity-discord-bot` | Production Discord bot with AI, slash commands, and PostgreSQL-backed leveling                | Rust, Tokio, Serenity, Poise, PostgreSQL, Docker, OpenTelemetry | —      |
| Markdown TOC Generator | `TODO` (URL unknown — leave TODO comment)            | CLI tool that generates and injects TOCs into Markdown files                                  | Rust                                                            | —      |
| Dotfiles               | `https://github.com/1Git2Clone/dotfiles`             | Fully configured Arch desktop — Hyprland/i3wm, red-themed Neovim, kitty, tmux                 | Shell, Lua                                                      | —      |
| Hunger Games Simulator | private/WIP                                          | Real-time multiplayer simulator with Discord OAuth2, WebSocket sync, JWT auth, testcontainers | Go, SvelteKit, PostgreSQL, Docker                               | WIP    |

**Styling**: inline in the page, not a separate component. Cards use
`border-border rounded-lg border bg-muted/40 p-8`. Tags are inline spans with
`border border-accent/30 rounded px-2 py-0.5 text-xs text-accent`.

### 2c. Hire CTA Section

Bottom section on the page:

- "Want to work together?" heading
- Email link: `href="mailto:ivankirilov640@gmail.com"`
- Match existing icon/link styling: `color: var(--color-accent)`, `0.2s ease`
  transitions

---

## 3. Homepage (`/`)

### Option A (preferred): Move Linux Journey to `/journey`

Replace the current homepage content with a professional intro:

```
Backend Engineer | Go & Rust

I build backend systems, fintech infrastructure, and developer tooling.

→ About Me  |  → GitHub

See my Linux journey →
```

- **Title**: "Welcome to 1Git2Clone!"
- **Subtitle**: "Backend Engineer | Go & Rust"
- **Short bio**: "I build backend systems, fintech infrastructure, and developer tooling."
- **CTAs**: "About Me →" (links to `/about-me`) and "GitHub →" (external, using
  existing `GITHUB_PROFILE_NAME` constant).
- **Subtle link to journey**: "See my Linux journey →" linking to `/journey`,
  placed unobtrusively below the intro section.

The HistoryTree is removed entirely from the homepage and moved to the new
route.

---

## 4. New Route: `/journey`

### `src/routes/journey/+page.svelte`

A simple page containing:

```svelte
<script lang="ts">
	import HistoryTree from '$lib/components/root/HistoryTree.svelte';
	import { LINUX_AND_DOTFILES_HISTORY_TREE } from '$lib/content/root/linux-and-dotfiles-history-tree';
</script>

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1>Linux Journey</h1>
		<HistoryTree history={LINUX_AND_DOTFILES_HISTORY_TREE} baseHeadingLevel={2} />
	</section>
</div>
```

Since there's no data loading needed, no `+page.server.ts` is required.

---

## Constraints

- **No color palette changes** — red accent, monospace font, dark/light toggle
  all preserved
- **No new dependencies**
- **Svelte 5 runes** (`$props`, `$state`, `$derived`, `$effect`)
- **No hardcoded hex colors** — use existing CSS tokens
- **TypeScript strict mode** — all new code fully typed
- **Existing component structure** — layout in `layout/`, page-specific in
  `root/` or inline

---

## Definition of Done

- [ ] About Me page has real bio content (no lorem ipsum)
- [ ] About Me page has a Projects section with 4 linked projects
- [ ] About Me page has an email-based hire CTA
- [ ] `EMAIL` constant added to `$lib/utils/consts.ts`
- [ ] Homepage shows professional intro with Linux journey moved to `/journey`
- [ ] `/journey` route serves the HistoryTree
- [ ] `bun run check` passes
- [ ] `bun run lint` passes
- [ ] Dark and light mode both look correct
- [ ] No hardcoded colors, no new fonts, no layout regressions
