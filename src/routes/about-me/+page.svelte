<script lang="ts">
	// Reason: Content is written by me.
	/* eslint-disable svelte/no-at-html-tags */

	const markdownTocUrl = ''; // TODO: add GitHub URL
</script>

<div class="space-y-8">
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
			<a href="mailto:ivankirilov640@gmail.com" class="inline-flex items-center gap-1">
				ivankirilov640@gmail.com
			</a>
		</p>
	</section>

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

	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 text-center dark:prose-invert"
	>
		<h2 id="hire">Want to work together?</h2>
		<p class="text-tertiary">
			Available remotely for backend systems, fintech APIs, developer tooling, and cloud infrastructure.
		</p>
		<p class="mt-4">
			<a href="mailto:ivankirilov640@gmail.com" class="text-lg">
				ivankirilov640@gmail.com
			</a>
		</p>
	</section>
</div>
