# CLAUDE.md — 1k2s Portfolio (hu-tao.dev)

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
- **Font**: JetBrains Mono Nerd Font (subset-optimized via `scripts/development/install-required-font-symbols.sh`)
- **Math**: KaTeX via `rehype-katex` + `remark-math`
- **Theme**: `mode-watcher` for dark/light switching
- **Search**: `fuse.js`
- **Package manager**: `pnpm`, version pinned by `packageManager` in `package.json`
- **Toolchain**: Nix flake dev shell (Node, pnpm, actionlint, shellcheck)
- **CI and deploys**: GitHub Actions; Netlify gets deploys from Actions only

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
    blogs/          # Blogs routes
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
  let {
    value = $bindable(0),
    label = "Default",
  }: { value: number; label?: string } = $props();
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

**Render in Svelte, not in strings.** Do not use `{@html}` with string-concatenated HTML to render lists, links, or repeated elements. Use real Svelte constructs (`{#each}`, `{#snippet}` + `{@render}`) so the output is SSR'd, Lighthouse-optimal, and free of XSRF surface for that path. The only exceptions are `{@html marked(project.description)}` where the content is authored markdown and the library is unavoidable, and `{@html jsonLdTag(...)}` in `Seo.svelte`, because Svelte can't render a JSON-LD script element — everything else should be native elements.

### Quick Reference

| Anti-Pattern (Svelte 4) | Correct (Svelte 5)             | Reason                           |
| ----------------------- | ------------------------------ | -------------------------------- |
| `let count = 0;`        | `let count = $state(0);`       | Explicit signal-based reactivity |
| `$: total = a + b;`     | `let total = $derived(a + b);` | Predictable dependency tracking  |
| `export let name;`      | `let { name } = $props();`     | Standardized component API       |
| `<slot />`              | `{@render children()}`         | Function-like UI composition     |
| `on:click={fn}`         | `onclick={fn}`                 | Native attribute standard        |
| `createEventDispatcher` | callback props                 | Removed in Svelte 5              |

### Store Access

- Use `$app/state` (not `$app/stores`) — e.g. `import { page } from '$app/state'`
- Use `$app/paths` for `resolve()` in hrefs

---

## Routing

- SvelteKit file-based routing under `src/routes/`
- Use `+page.server.ts` for server-side data loading
- Use `+page.svelte` for page components
- Blog posts are `.md` files processed by mdsvex with the `MarkdownLayout.svelte` layout

### Page meta (title, OpenGraph, schema.org)

- `src/lib/data/seo.ts` holds the meta for each page route in `ROUTES`. The
  key type comes from SvelteKit's `RouteId`. A page route with no entry, or
  an entry for a route that does not exist, fails `svelte-check`.
- `src/lib/components/layout/Seo.svelte` renders all head tags from the
  layout. Do not add `<svelte:head>` meta to a page. `+error.svelte` keeps
  its own `<title>`.
- When you add a page route, add its entry to `ROUTES`. When you add an
  endpoint (`+server.ts`), add its id to `PageRouteId`'s `Exclude` list.
- Canonical URLs use the `Pathname` type, not `resolve()`. `resolve()` gives
  relative paths when it prerenders.
- Post dates in frontmatter are strings. Convert them with `publishedDate()`,
  not `toISOString()`, so that the day does not change with the timezone.

---

## Styling Rules

1. **Tailwind v4** — config is CSS-first via `@theme` in `layout.css`, not `tailwind.config.ts` (the `.ts` file is legacy/partially used)
2. Use `@plugin` directives for forms/typography with `strategy: "class"`
3. Dark mode via `[class~="dark"]` selector — toggled by `mode-watcher`
4. Never use arbitrary hex values inline — always reference a token
5. `scrollbar-gutter: stable` on `html` — preserve this, it prevents layout shift
6. `img { margin: auto }` is global — keep this
7. **Tailwind-first styling** — prefer Tailwind utility classes over `<style>` blocks. Load the `tailwind-first-styling` skill for the complete convention and boundary rules.

---

## Commands

Run all commands in the dev shell. `bun` and a global `pnpm` are not on the
path.

```bash
nix develop -c pnpm install --frozen-lockfile  # Install or refresh node_modules
nix develop -c pnpm run dev       # Start dev server
nix develop -c pnpm run build     # Production build
nix develop -c pnpm run preview   # Preview production build
nix develop -c pnpm run check     # Type-check with svelte-check
nix develop -c pnpm run lint      # Oxfmt check + Oxlint (Vite+)
nix develop -c pnpm run format    # Auto-format with Oxfmt
nix develop -c actionlint         # Lint the GitHub workflows
nix develop -c shellcheck scripts/*/*.sh
nix develop -c pre-commit install  # Once per clone: the pre-push hook
nix develop -c scripts/checks/glsl.sh  # Validate the GLSL shaders
nix develop -c scripts/development/install-required-font-symbols.sh  # Re-subset font after adding new characters
```

If `vp` is not found, `node_modules` is stale. Run the install command.

---

## Formatting

- Oxfmt uses Prettier's defaults: 2 spaces, double quotes, trailing commas.
  `printWidth` is 80. The config is the `fmt` block in `vite.config.ts`.
- These are the same defaults that editors use. Do not change them to tabs or
  single quotes.
- Do not format code by hand. Run `pnpm run format`.
- An editor save that changes only formatting is not a content change. Do not
  revert it.

---

## CI and Deploys

- `.github/workflows/ci.yml` runs on each push to `main` and on each PR. It
  has one job for each stage. Each job calls one composite action:
  - `.github/actions/checks/`: `format`, `lint`, `typecheck`, `build`,
    `actionlint`, `shellcheck`, `glsl`, `netlify-token`.
  - `.github/actions/tests/`: `unit` (runs `pnpm test`).
  - `.github/actions/deploy/`: `netlify`, `comment`. The `deploy` job runs
    only when all checks and tests pass. On `main`, it deploys to production.
    On a PR from this repo, it deploys a `pr-<n>` preview, and `comment` puts
    its URL on the PR. Later pushes edit that comment.
  - `.github/actions/setup/`: pnpm, Node and install. The other actions use it.
- GitHub reads workflows only from `.github/workflows/`, not from
  subdirectories. Put stage logic in composite actions, not in new workflows.
- To add a stage, add `.github/actions/<group>/<stage>/action.yml` and one job
  in `ci.yml`. Add the job to the `needs` list of `deploy`.
- A `run:` step in a composite action must have `shell: bash`.
- `pnpm test` runs the assert-based tests in `scripts/checks/*.ts`. Add a new
  test file to the `test` script in `package.json`.
- Each deploy is a GitHub deployment. Read its status in GitHub, not in the
  Netlify UI.
- Netlify's own Git builds are stopped. Do not turn them on again.
- Put shell logic in `scripts/<group>/*.sh`. A `run:` step calls one script or
  one command. The groups are `ci/` (only CI runs it), `checks/` (CI and
  local checks) and `development/` (local tools, such as the font subset).
- Give a secret only to the step that uses it. Do not put it in job `env`.
- Pin third-party actions to a full commit SHA, with the version in a
  comment. GitHub's `actions/*` can use a major tag.
- The pre-push hook (`.pre-commit-config.yaml`) runs `scripts/checks/commits.sh`:
  `svelte-check` and `pnpm test` on each pushed commit, not only the tip.
  Split a change into commits with the generated files that each one needs.
- Each new check must fail in CI. Break it on purpose one time and see it
  fail before you commit it.

### Netlify token

- `NETLIFY_AUTH_TOKEN` is a repo secret. It expires after 90 days.
- Netlify's API does not give the expiry date. The repo variable
  `NETLIFY_TOKEN_EXPIRES` (`YYYY-MM-DD`) holds it.
- `.github/workflows/netlify-token.yml` runs each day. It fails when fewer
  than 7 days are left, or when Netlify rejects the token.
- To rotate the token, make a new token in Netlify, then run:

  ```bash
  gh secret set NETLIFY_AUTH_TOKEN
  gh variable set NETLIFY_TOKEN_EXPIRES --body YYYY-MM-DD
  ```

---

## Type Safety

- Do not use plain `string` for a reference to a known set of values. Use a
  literal union from the data, for example `as const` ids or SvelteKit's
  `RouteId`.
- A typo or a deleted target must fail `svelte-check`. Example: `link()` in
  `src/lib/content/infra/topology.ts` accepts only real node ids.

---

## Infra Content

- `/infra` must show the real infrastructure. When a service moves (for
  example, from public to tailnet only), update both files:
  - `src/lib/content/infra/services.ts`: the public or private table.
  - `src/lib/content/infra/topology.ts`: the node `kind`, its links, and the
    descriptions that name it.

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

### Branch or `main`

- A small, one-off fix can go on `main` when the user allows it.
- A large change goes on a `<type>/<task>` branch with a PR. CI then runs
  before the change reaches `main`.
- Put a reformat in its own commit. Do not mix it with logic changes.
- Read each review comment on the PR. Check the claim before you fix it.

---

## Agent Workflow

### Output style

- Write all replies in ASD-STE100 Simplified Technical English, at about 80%
  strictness.
- Use short sentences: 20 words or fewer for an instruction, 25 or fewer for a
  description.
- Use the active voice. Give one instruction in each sentence.
- Use simple, common words. Do not use idioms.
- Give more explanation only when the user asks for it.
- This rule is for chat output. Code, commits and site copy keep their own
  style.

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
- `data-over-type-redesign` — Add entries to existing data structures; don't redesign types or interfaces
- `widen-to-fit-is-a-smell` — Don't widen type-safe parameters; make new data fit the existing contract
- `orchestrator-verification-gate` — Verify your own output (merges, trailers, config) separately from subagent work
- `read-the-full-pattern-first` — Read the entire file before planning any change
- `tailwind-first-styling` — Prefer Tailwind utility classes over raw CSS in `<style>` blocks; only use `<style>` for pseudo-elements, complex selectors, keyframes, or reusable component classes
- `accurate-experience-positioning` — Keep portfolio/about-me claims accurate: junior AI developer, early professional tenure, no company Rust usage, no inflated senior/backend claims
- `typed-task-branch-names` — Branch names must use `<type>/<task>` format, e.g. `feat/refine-about-me-ai-positioning`
- `one-off-main-commits` — Small one-off fixes may be committed directly to `main` when explicitly allowed; still stage narrowly and include trailers
- `no-delayed-hash-scroll-fixes` — Do not fix hash-link offsets with delayed JS re-scrolls; fix anchor targets, `scroll-mt-*`, or smooth-scroll/transition conflicts
- `plural-collection-routes` — Collection pages use plural routes and labels, e.g. `/blogs` and `Blogs`
