<script lang="ts">
	import Highlight from '$lib/components/Highlight.svelte';
	import Fuse from 'fuse.js';
	import { POST_SEARCH_FZF, postKey } from '$lib/data/posts';
	import { resolve } from '$app/paths';

	let { data } = $props();
	let searchQuery = $state('');
	let searchInput: HTMLInputElement | undefined = $state();

	const fuse = $derived(
		new Fuse(data.posts, {
			keys: [
				{ name: postKey('metadata.title'), weight: 1 },
				{ name: postKey('metadata.summary'), weight: 0.5 },
				{ name: postKey('metadata.tags'), weight: 0.4 },
				{ name: postKey('slug'), weight: 0.3 }
			],
			threshold: 0.4,
			includeMatches: POST_SEARCH_FZF
		})
	);

	let searchDisplay = $derived(
		searchQuery.trim().length > 0
			? fuse.search(searchQuery.trim())
			: data.posts.map((p) => ({ item: p, matches: [] }))
	);

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
			e.preventDefault();
			searchInput?.focus();
		}
		if (e.code === 'Escape') {
			e.preventDefault();
			searchInput?.blur();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-8">
	<section class="border-border flex flex-col items-center rounded-lg border bg-muted/40 p-8">
		<h1 class="text-center text-4xl font-bold tracking-tight">Blogs</h1>
		<div
			class="border-border bg-background mt-6 flex w-full max-w-md items-center gap-2 rounded border px-2 py-1 transition-shadow focus-within:ring-2 focus-within:ring-primary"
		>
			<span
				class="text-muted-foreground flex size-10 items-center justify-center text-xl leading-none"
				style="transform: translateX(-2px);"
			>
				
			</span>
			<input
				bind:this={searchInput}
				type="text"
				bind:value={searchQuery}
				placeholder="Search posts..."
				class="placeholder:text-muted-foreground w-full border-0 bg-transparent ring-0 outline-none focus:border-0 focus:ring-0 focus:outline-none"
			/>
			<kbd
				class="hidden h-8 w-16 items-center justify-around gap-2 rounded bg-muted px-2 text-lg opacity-100 md:inline-flex"
			>
				<span class=""> ⌘ </span> K
			</kbd>
		</div>
		<p id="search-results" class="mt-4">
			{#if searchQuery.trim() && searchDisplay.length > 0}
				{@const n = searchDisplay.length}
				{@const N = data.posts.length}

				{n}/{N} results for search: "<b>{searchQuery.trim()}</b>".
			{/if}
		</p>
	</section>

	<section class="grid gap-6 md:grid-cols-2">
		{#each searchDisplay as result, i (result.item.slug + '-' + i)}
			{@const post = result.item}
			<div class="border-border rounded-lg border p-6 transition-all">
				<h2 class="text-xl font-semibold">
					<a class="text-xl underline hover:text-textcol" href={resolve(`/blogs/${post.slug}`)}>
						<Highlight
							text={post.metadata.title}
							matches={result.matches}
							path={postKey('metadata.title')}
						/>
					</a>
				</h2>
				<div class="flex flex-wrap gap-4 text-sm text-subtextcol">
					{#if post.metadata.date}
						<span>{post.metadata.date}</span>
					{/if}
					{#if post.metadata.readingTime}
						<span>{post.metadata.readingTime}</span>
					{/if}
				</div>
				<p class="text-muted-foreground mt-2">
					<Highlight
						text={post.metadata.summary}
						matches={result.matches}
						path={postKey('metadata.summary')}
					/>
				</p>
				{#if post.metadata.tags}
					<span class="text-sm text-subtextcol">
						<b>Tags</b>:

						<Highlight
							text={post.metadata.tags.join(', ')}
							matches={result.matches}
							path={postKey('metadata.tags')}
						/>
					</span>
				{/if}
			</div>
		{:else}
			<div class="col-span-full py-10 text-center text-muted-foreground">
				No posts found matching "{searchQuery}"
			</div>
		{/each}
	</section>
</div>

<style>
	/* Ensure no weird layout shift when searching. */
	#search-results::after {
		content: '\200b';
		visibility: hidden;
	}
</style>
