# CLAUDE.md — 1k2s Portfolio (hu-tao.org)

## Project Overview

Personal portfolio and blog site for Ivan (1Git2Clone). Built with SvelteKit,
Tailwind CSS v4, mdsvex (Markdown + Svelte), and deployed to Netlify. The site
has a dark/light theme system, a custom red accent palette, JetBrains Mono Nerd
Font, and mdsvex-powered blog with KaTeX, YouTube embeds, and reading time.

---

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes: `$props`, `$state`, etc.)
- **Styling**: Tailwind CSS v4 (CSS-first config via `layout.css` `@theme`)
- **Markdown**: mdsvex with custom remark/rehype plugins
- **Adapter**: `@sveltejs/adapter-netlify`
- **Font**: JetBrains Mono Nerd Font (subset-optimized via `install_required_font_symbols.sh`)
- **Math**: KaTeX via `rehype-katex` + `remark-math`
- **Theme**: `mode-watcher` for dark/light switching
- **Search**: `fuse.js`
- **Package manager**: `bun`

---

## Design System

### Color Tokens (defined in `src/layout.css`)

Always use CSS variables or Tailwind token names — never hardcode hex values.

| Token                  | Light            | Dark                    | Usage                     |
| ---------------------- | ---------------- | ----------------------- | ------------------------- |
| `--color-primary`      | `#bbbbbb`        | `#181818`               | Page background           |
| `--color-textcol`      | `#333333`        | `#dddddd`               | Body text                 |
| `--color-subtextcol`   | `#111111`        | `#eeeeee`               | Headings, emphasis        |
| `--color-muted`        | `#eaeaea`        | `#242424`               | Card/section backgrounds  |
| `--color-tertiary`     | `#9e9e9e`        | `#6a6a6a`               | Captions, metadata        |
| `--color-accent`       | `red-700`        | `red-400`               | Links, highlights, icons  |
| `--color-accent-hover` | `red-800+black`  | `red-200`               | Hover states              |
| `--color-accent-bg`    | `red-900`        | `red-900`               | Subtle accent backgrounds |
| `--color-highlight`    | `red-700+black`  | `rose-200`              | KaTeX, inline emphasis    |
| `--color-code-block`   | `rgba(20,4,4,1)` | `rgba(200,100,100,0.1)` | Code block backgrounds    |

### Typography

- Font: JetBrains Mono Nerd Font (monospace everywhere — this is intentional)
- Use `prose` + `dark:prose-invert` for markdown/blog content
- Prose link color overridden to `--color-accent` via `@layer utilities`
- Headings use `scroll-mt-22` for anchor offset

### Component Conventions

- Sections use: `border-border rounded-lg border bg-muted/40 p-8`
- Page wrappers use: `prose w-full max-w-none space-y-8 dark:prose-invert`
- Transitions: page-level uses `fly` in (y: 12, 200ms, delay 200ms) + `fade` out via `grid-stack`
- Icons: SVG with `fill: currentColor` — color transitions via `a svg { transition: fill 0.2s ease }`
- Buttons/links: `color: var(--color-accent)` with `0.2s ease` transitions

---

## File Structure Conventions

```
src/
  lib/
    components/
      layout/       # Header, Footer
      root/         # Homepage-specific components (HistoryTree, etc.)
      blog/         # Blog-specific components (MarkdownLayout, etc.)
    content/
      root/         # Static data for homepage sections
    styles/         # katex.css, font.css
    utils/          # consts.ts, snippets.ts, etc.
  routes/
    +layout.svelte  # Global layout (Header, Footer, ModeWatcher, transitions)
    +page.svelte    # Homepage
    blog/           # Blog routes
    about-me/       # About/portfolio route
plugins/
  remark/           # Custom remark plugins (headings, reading-time, youtube, code-block, blog-assets)
  rehype/           # Custom rehype plugins (katex, heading-ids)
static/
  fonts/            # JetBrains Mono Nerd Font (optimized woff2)
```

---

## Svelte 5 Patterns

This project uses **Svelte 5 runes only**. Legacy Svelte 4 syntax is a logic error and must be refactored.

### State & Reactivity

- ❌ `let x = 0` + `$: y = x * 2` — forbidden
- ✅ `let x = $state(0)` for mutable state, `let y = $derived(x * 2)` for computed values

### Component Interface (Props)

- ❌ `export let name` — forbidden
- ✅ `let { name } = $props()` — always typed, use `$bindable()` for two-way bindings
```svelte
<script lang="ts">
	let { value = $bindable(0), label = 'Default' }: { value: number; label?: string } = $props();
</script>
```

### Composition (Slots)

- ❌ `<slot />` and `let:item` — deprecated
- ✅ `{@render children()}` and snippet props for named sections

### Event Handlers

- ❌ `createEventDispatcher` — removed in Svelte 5
- ✅ Pass callback functions as standard props
- ❌ `on:click={fn}` — removed
- ✅ `onclick={fn}` — native attribute syntax

### Lifecycle

- ❌ `beforeUpdate` / `afterUpdate` — deprecated
- ✅ `$effect()` for DOM-side effects; `$derived` for computed state

### Rendering

**Render in Svelte, not in strings.** Do not use `{@html}` with string-concatenated HTML to render lists, links, or repeated elements. Use real Svelte constructs (`{#each}`, `{#snippet}` + `{@render}`) so the output is SSR'd, Lighthouse-optimal, and free of XSRF surface for that path. The only exception is `{@html marked(project.description)}` where the content is authored markdown and the library is unavoidable — everything else should be native elements.

### Quick Reference

| Anti-Pattern (Svelte 4) | Correct (Svelte 5) | Reason |
|---|---|---|
| `let count = 0;` | `let count = $state(0);` | Explicit signal-based reactivity |
| `$: total = a + b;` | `let total = $derived(a + b);` | Predictable dependency tracking |
| `export let name;` | `let { name } = $props();` | Standardized component API |
| `<slot />` | `{@render children()}` | Function-like UI composition |
| `on:click={fn}` | `onclick={fn}` | Native attribute standard |
| `createEventDispatcher` | callback props | Removed in Svelte 5 |

### Store Access

- Use `$app/state` (not `$app/stores`) — e.g. `import { page } from '$app/state'`
- Use `$app/paths` for `resolve()` in hrefs

---

## Routing

- SvelteKit file-based routing under `src/routes/`
- Use `+page.server.ts` for server-side data loading
- Use `+page.svelte` for page components
- Blog posts are `.md` files processed by mdsvex with the `MarkdownLayout.svelte` layout

---

## Styling Rules

1. **Tailwind v4** — config is CSS-first via `@theme` in `layout.css`, not `tailwind.config.ts` (the `.ts` file is legacy/partially used)
2. Use `@plugin` directives for forms/typography with `strategy: "class"`
3. Dark mode via `[class~="dark"]` selector — toggled by `mode-watcher`
4. Never use arbitrary hex values inline — always reference a token
5. `scrollbar-gutter: stable` on `html` — preserve this, it prevents layout shift
6. `img { margin: auto }` is global — keep this

---

## Commands

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run preview      # Preview production build
bun run check        # Type-check with svelte-check
bun run lint         # Prettier + ESLint check
bun run format       # Auto-format with Prettier
bash install_required_font_symbols.sh  # Re-subset font after adding new characters
```

---

## Commit Conventions

Follow Conventional Commits:

```
type(scope): short description

Body explaining what and why.

Co-authored-by: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`

- Scan `git log --oneline -50` before committing to match existing scope conventions
- Run `git diff --cached --check` before committing to catch trailing whitespace
- **Do not push to any remote without explicit confirmation**
- **Do not work on `main` without explicit confirmation**
- Never amend a pushed commit without confirmation

---

## Agent Workflow

### Before starting work

- Check `.opencode/memory` for project-specific memory entries and surface relevant ones
- Confirm the target branch — do not assume `main`
- For ambiguous requirements, ask clarifying questions before proceeding

### Brainstorming

Invoke brainstorming when:

- Requirements are ambiguous
- The change touches multiple systems or has unclear scope

Skip brainstorming for small, well-specified changes.

### Error handling

| Severity | Examples                                 | Response                 |
| -------- | ---------------------------------------- | ------------------------ |
| Critical | git failures, missing deps, broken build | Stop and report verbatim |
| Medium   | optional tool failures, lint warnings    | Note and continue        |
| Minor    | transient warnings                       | Retry once or ignore     |

Never auto-retry without confirmation unless the failure is clearly transient.

### Secrets

- Never commit secrets, `.env` files, tokens, or private keys
- If a staged diff contains obvious secret patterns, abort and warn with file + line reference
- Do not store sensitive values in agent memory — reference abstractly

### Destructive operations — always confirm first

- `reset --hard`, `clean -fd`, branch deletion
- Force pushes or history rewrites
- Any push to a remote
- Working on `main` or protected branches

---

## What This Site Is NOT

- Not a generic blog template — the monospace aesthetic and red theme are intentional
- Not a corporate portfolio — the personal voice ("Quite ironic, isn't it?") is intentional
- Do not introduce sans-serif fonts, blue accent colors, or card-heavy layouts without explicit instruction

## Project Skills

Project-specific skills live in `.agents/skills/` and are loaded via the `skill` tool:

- `calibrating-from-misalignment` — When user points out an expectation gap, write a skill to prevent recurrence
- `committing-with-trailers` — Every commit must have correct `Co-authored-by:` (and other) trailers
- `single-responsibility-commits` — Each commit is one logical change; unrelated files get separate commits
- `no-unsolicited-restyling` — When adding data/content, preserve existing UI structure; don't redesign unless explicitly asked
