<script lang="ts">
	import { SITE_TITLE } from '$lib/utils/consts';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	let { data } = $props();
</script>

<div class="min-w-0 space-y-8">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 class="text-4xl font-bold tracking-tight">Welcome to {SITE_TITLE}!</h1>
		<p class="text-muted-foreground mt-4 text-lg">My personal portfolio and blog page.</p>

		<p class="text-muted-foreground mt-4 text-lg">
			I've been programming since 9<sup>th</sup> grade in high-school. The main thing that brought
			me into the field was my child self saying how I'd show my parents that my love for video
			games wouldn't disappear when I become older and instead I'd be
			<span class="text-accent">"making video games"</span>. Fast forward to {new Date().getFullYear()}
			and I'm a programmer who does most types of programming… but not game development. Quite ironic,
			isn't it?
		</p>
	</section>
	<div class="flex w-full min-w-0 flex-col overflow-hidden">
		<section class="w-full min-w-0 overflow-hidden">
			<CodeBlock lang={data.snippets['main.rs'].language}
				>{data.snippets['main.rs'].content}</CodeBlock
			>
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
</div>
