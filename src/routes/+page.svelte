<script lang="ts">
	import { SITE_TITLE, CURRENT_YEAR } from '$lib/utils/consts';
	// import CodeBlock from '$lib/components/CodeBlock.svelte';
	import HistoryTree from '$lib/components/root/HistoryTree.svelte';
	import { LINUX_AND_DOTFILES_HISTORY_TREE } from '$lib/content/root/linux-and-dotfiles-history-tree';
	import { resolve } from '$app/paths';
	// let { data } = $props();
</script>

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 id="title" class="text-4xl font-bold tracking-tight">Welcome to {SITE_TITLE}!</h1>
		<p>
			My personal <a href={resolve('/about-me')}>portfolio</a> and
			<a href={resolve('/blog')}>blog</a> page.
		</p>

		<p>
			I've been programming since 9<sup>th</sup> grade in high-school. The main thing that brought
			me into the field was my child self saying how I'd show my parents that my love for video
			games wouldn't disappear when I become older and instead I'd be
			<span class="text-accent">"making video games"</span>. Fast forward to {CURRENT_YEAR}
			and I'm a programmer who does most types of programming… but not game development. Quite ironic,
			isn't it?
		</p>

		<p>Anyway, here's my Linux journey!</p>

		<h2 class="mt-2">Linux Journey</h2>

		<HistoryTree history={LINUX_AND_DOTFILES_HISTORY_TREE} baseHeadingLevel={3} />
	</section>
	<!--
	<div class="flex w-full min-w-0 flex-col overflow-hidden">
		<section class="w-full min-w-0 overflow-hidden">
			<CodeBlock lang={data.snippets['main.rs'].lang}>{data.snippets['main.rs'].content}</CodeBlock>
		</section>
	</div>

	<section class="grid gap-6 text-center md:grid-cols-3">
		{#each [1, 2, 3] as i (i)}
			<div class="border-border rounded-lg border p-6">
				<h2 class="text-xl font-semibold">Feature {i}</h2>
				<p class="text-muted-foreground mt-2">
					This is a card component that will respect your theme preferences.
				</p>
			</div>
		{/each}
	</section>
  -->
</div>
