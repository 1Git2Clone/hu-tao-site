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
			<a href="/journey" class="inline-flex items-center gap-1">
				See my Linux journey <span aria-hidden="true">→</span>
			</a>
		</div>
	</section>
</div>
