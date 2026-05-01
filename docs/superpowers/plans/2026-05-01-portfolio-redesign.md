# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorient the personal site toward also serving as a professional portfolio — replace lorem ipsum with real content, add a projects section, move the Linux journey to its own route, and add a hire CTA.

**Architecture:** All changes are content/layout only — no new data loading, no new API routes, no new dependencies. One new route (`/journey`) hosts the existing HistoryTree component. Existing pages get content swaps and new inline sections.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), Tailwind CSS v4, TypeScript strict mode.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/utils/consts.ts` | Modify (add constant) | Add `EMAIL` export |
| `src/routes/+page.svelte` | Modify | Replace Linux journey with professional intro |
| `src/routes/journey/+page.svelte` | Create | New route hosting HistoryTree |
| `src/routes/about-me/+page.svelte` | Modify | Replace bio, add portfolio projects section, add hire CTA |

---

### Task 1: Add EMAIL constant

**Files:**
- Modify: `src/lib/utils/consts.ts:1-7`

- [ ] **Step 1: Add EMAIL export to consts.ts**

Add after the existing `BLOG_ITEMS_EXTENSION` line:

```ts
export const EMAIL = 'ivan@hu-tao.dev';
```

The full file should look like:

```ts
export const GITHUB_PROFILE_NAME = '1Git2Clone';
export const TWITTER_PROFILE_HANDLE = '@1kill2steal';
export const SITE_TITLE_SHORT = '1G2C';
export const SITE_TITLE = '1Git2Clone';
export const CURRENT_YEAR = new Date().getFullYear();
export const BLOG_ITEMS_EXTENSION: 'md' | 'mdx' | 'svx' = 'md';
export const EMAIL = 'ivan@hu-tao.dev';
```

- [ ] **Step 2: Verify with `bun run check`**

Run: `bun run check`
Expected: No errors.

---

### Task 2: Rewrite homepage — replace Linux journey with professional intro

**Files:**
- Modify: `src/routes/+page.svelte:1-51`

- [ ] **Step 1: Rewrite homepage content**

Replace the entire file content with:

```svelte
<script lang="ts">
	import { SITE_TITLE, GITHUB_PROFILE_NAME } from '$lib/utils/consts';
	import { resolve } from '$app/paths';
	import GitHub from '$lib/components/icons/GitHub.svelte';
</script>

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 id="title" class="text-4xl font-bold tracking-tight">Welcome to {SITE_TITLE}!</h1>
		<p class="text-lg text-subtextcol">Backend Engineer | Go & Rust</p>

		<p>
			I build backend systems, fintech infrastructure, and developer tooling. Take a look at my
			<a href={resolve('/about-me')}>projects</a> or find me on
			<a href={`https://github.com/${GITHUB_PROFILE_NAME}`}>GitHub</a>.
		</p>

		<div class="mt-6 flex gap-6 text-sm">
			<a href={resolve('/about-me')} class="inline-flex items-center gap-1">
				About Me <span aria-hidden="true">→</span>
			</a>
			<a
				href={`https://github.com/${GITHUB_PROFILE_NAME}`}
				class="inline-flex items-center gap-1"
			>
				<GitHub width={18} height={18} />
				GitHub
			</a>
		</div>

		<div class="mt-8 text-sm text-tertiary">
			<a href={resolve('/journey')} class="inline-flex items-center gap-1">
				See my Linux journey <span aria-hidden="true">→</span>
			</a>
		</div>
	</section>
</div>
```

- [ ] **Step 2: Verify the page renders**

Run: `bun run check`
Expected: No errors.

---

### Task 3: Create `/journey` route

**Files:**
- Create: `src/routes/journey/+page.svelte`

- [ ] **Step 1: Create the journey page**

```svelte
<script lang="ts">
	import HistoryTree from '$lib/components/root/HistoryTree.svelte';
	import { LINUX_AND_DOTFILES_HISTORY_TREE } from '$lib/content/root/linux-and-dotfiles-history-tree';
</script>

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 id="title" class="text-4xl font-bold tracking-tight">Linux Journey</h1>

		<p>My journey into the Linux world — from first install to current setup.</p>

		<HistoryTree history={LINUX_AND_DOTFILES_HISTORY_TREE} baseHeadingLevel={2} />
	</section>
</div>
```

- [ ] **Step 2: Verify with type check**

Run: `bun run check`
Expected: No errors.

---

### Task 4: Rewrite the entire About Me page

**Files:**
- Rewrite: `src/routes/about-me/+page.svelte`

The existing page has:
- Script imports: `slugify`, `PROJECTS`, `marked`, `hostToSocial`, `SocialMedia`
- `getSocialMedia()` function
- Bio `<section>` with lorem ipsum
- Old PROJECTS grid `<section>` (lines 33-130) — this must be removed entirely
- `<style>` block with `.project-image-border` — must be removed (only used by old grid)

The replacement will have:
- New script: only the import needed (the email is used inline, no const import needed since `$lib/utils/consts` has `EMAIL` but we can use the string directly)
- Bio section with real content
- Portfolio projects section (Task 5)
- Hire CTA section (Task 6)

- [ ] **Step 1: Remove unused imports and the getSocialMedia function**

In the `<script>` block (lines 1-16), replace the entire script with:

```svelte
<script lang="ts">
	// Reason: Content is written by me.
	/* eslint-disable svelte/no-at-html-tags */
</script>
```

- [ ] **Step 2: Replace the bio section with real content**

Replace the old bio `<section>` (currently lines 18-31) with:

```svelte
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert"
	>
		<h1 id="title" class="mb-2 text-center">1Git2Clone</h1>
		<p class="text-center text-sm text-subtextcol">
			Backend Engineer | Go & Rust | Fintech & Developer Tooling
		</p>

		<p>
			Go and Rust backend engineer with production experience in fintech infrastructure —
			microservices, REST APIs, PostgreSQL, WebSockets, JWT authentication, and Docker. I've
			deployed PCI-adjacent financial services on AWS and built AI/MCP infrastructure for enterprise
			codebases.
		</p>

		<p>
			I deliver working, correct code — not just generated output. I've caught and replaced fake
			parser implementations with proper AST-based solutions, redesigned broken data pipelines, and
			made architectural decisions that held up in production. I take ownership of problems beyond the
			immediate ticket.
		</p>

		<p>
			Outside of client work, I build open-source developer tooling used by thousands of developers
			worldwide, which keeps me sharp on the latest ecosystem patterns and best practices.
		</p>

		<p>
			Available remotely for backend systems, fintech APIs, developer tooling, and cloud
			infrastructure. Fast communicator, honest about scope.
		</p>

		<p class="mt-6">
			<a href="mailto:ivan@hu-tao.dev" class="inline-flex items-center gap-1">
				ivan@hu-tao.dev
			</a>
		</p>
	</section>
```

- [ ] **Step 3: Remove the old PROJECTS grid section**

Delete lines 33-130 (the old projects grid with `{#each PROJECTS as project, i ...}`) entirely.

- [ ] **Step 4: Remove the old `<style>` block**

Delete lines 133-145 (the `<style>` block with `.project-image-border`).

- [ ] **Step 5: Verify with type check**

Run: `bun run check`
Expected: No errors.

---

### Task 5: Add portfolio projects section to About Me

**Files:**
- Modify: `src/routes/about-me/+page.svelte` (add new section after the bio section, which is now the first/only section)

- [ ] **Step 1: Add the portfolio projects section after the bio section**

Insert this after the closing `</section>` of the bio (which is now the current last line of the page):

```svelte
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert"
	>
		<h2 id="projects">Projects</h2>

		<div class="not-prose space-y-4">
			<!-- Serenity Discord Bot -->
			<div class="border-border rounded-lg border bg-muted/40 p-6">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h3 class="m-0 text-lg font-semibold">
						<a
							href="https://github.com/1Git2Clone/serenity-discord-bot"
							target="_blank"
							rel="noopener noreferrer"
						>
							Serenity Discord Bot
						</a>
					</h3>
				</div>
				<p class="mt-1 text-sm text-tertiary">
					A production Discord bot with AI integration, slash commands, and PostgreSQL-backed leveling.
				</p>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each ['Rust', 'Tokio', 'Serenity', 'Poise', 'PostgreSQL', 'Docker', 'OpenTelemetry'] as tag}
						<span
							class="border-accent/30 rounded border px-2 py-0.5 text-xs text-accent"
						>{tag}</span
						>
					{/each}
				</div>
			</div>

			<!-- Markdown TOC Generator -->
			<div class="border-border rounded-lg border bg-muted/40 p-6">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h3 class="m-0 text-lg font-semibold">
						{@const markdownTocUrl = '' /* TODO: add GitHub URL */ }
						{#if markdownTocUrl}
							<a href={markdownTocUrl} target="_blank" rel="noopener noreferrer">
								Markdown TOC Generator
							</a>
						{:else}
							Markdown TOC Generator
						{/if}
					</h3>
				</div>
				<p class="mt-1 text-sm text-tertiary">
					CLI tool that generates and injects tables of contents into Markdown files.
				</p>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each ['Rust'] as tag}
						<span
							class="border-accent/30 rounded border px-2 py-0.5 text-xs text-accent"
						>{tag}</span
						>
					{/each}
				</div>
			</div>

			<!-- Dotfiles -->
			<div class="border-border rounded-lg border bg-muted/40 p-6">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h3 class="m-0 text-lg font-semibold">
						<a
							href="https://github.com/1Git2Clone/dotfiles"
							target="_blank"
							rel="noopener noreferrer"
						>
							Dotfiles
						</a>
					</h3>
				</div>
				<p class="mt-1 text-sm text-tertiary">
					Fully configured Arch Linux desktop environment with a red-themed Neovim, kitty, and tmux setup.
				</p>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each ['Shell', 'Lua'] as tag}
						<span
							class="border-accent/30 rounded border px-2 py-0.5 text-xs text-accent"
						>{tag}</span
						>
					{/each}
				</div>
			</div>

			<!-- Hunger Games Simulator -->
			<div class="border-border rounded-lg border bg-muted/40 p-6">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h3 class="m-0 text-lg font-semibold">
						Hunger Games Simulator
						<span class="text-tertiary text-xs font-normal">(WIP)</span>
					</h3>
				</div>
				<p class="mt-1 text-sm text-tertiary">
					Real-time multiplayer simulator with Discord OAuth2, WebSocket sync, JWT auth, and testcontainers
					integration testing.
				</p>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each ['Go', 'SvelteKit', 'PostgreSQL', 'Docker'] as tag}
						<span
							class="border-accent/30 rounded border px-2 py-0.5 text-xs text-accent"
						>{tag}</span
						>
					{/each}
				</div>
			</div>
		</div>
	</section>
```

- [ ] **Step 2: Verify with type check**

Run: `bun run check`
Expected: No errors.

---

### Task 6: Add hire CTA section

**Files:**
- Modify: `src/routes/about-me/+page.svelte` (add CTA section after portfolio projects section)

- [ ] **Step 1: Add the hire CTA section**

Insert this after the closing `</section>` of the portfolio projects section (the last element on the page):

```svelte
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 text-center dark:prose-invert"
	>
		<h2 id="hire">Want to work together?</h2>
		<p class="text-tertiary">
			Available remotely for backend systems, fintech APIs, developer tooling, and cloud infrastructure.
		</p>
		<p class="mt-4">
			<a href="mailto:ivan@hu-tao.dev" class="text-lg">
				ivan@hu-tao.dev
			</a>
		</p>
	</section>
```

- [ ] **Step 2: Verify the full about-me page compiles**

Run: `bun run check`
Expected: No errors.

- [ ] **Step 3: Run full lint check**

Run: `bun run lint`
Expected: Clean or only pre-existing warnings.

---

## Verification

- [ ] **Step 1: Full type check**

Run: `bun run check`
Expected: No errors.

- [ ] **Step 2: Full lint**

Run: `bun run lint`
Expected: Clean.

- [ ] **Step 3: Manual visual check**

Check dark mode and light mode for:
- Homepage — professional intro renders, journey link works
- `/journey` — HistoryTree renders correctly
- `/about-me` — bio is real content, portfolio projects visible, hire CTA at bottom

---

## Spec Coverage

| Spec requirement | Task |
|---|---|
| Replace lorem ipsum About Me bio | Task 4 |
| Add portfolio projects section | Task 5 |
| Move Linux journey to `/journey` | Task 3 |
| Homepage professional intro | Task 2 |
| Hire/contact CTA | Task 6 |
| `EMAIL` constant | Task 1 |
| `bun run check` passes | Verification |
| Dark/light mode correct | Manual verification |
