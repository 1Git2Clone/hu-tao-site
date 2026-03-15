<script lang="ts">
	import Highlight from '$lib/components/Highlight.svelte';
	import Fuse from 'fuse.js';
	import { POST_SEARCH_FZF, postKey } from '$lib/data/posts';

	let { data } = $props();
	let searchQuery = $state('');

	const fuse = $derived(
		new Fuse(data.posts, {
			keys: [
				{ name: postKey('metadata.title'), weight: 1 },
				{ name: postKey('metadata.summary'), weight: 0.5 },
				{ name: postKey('slug'), weight: 0.3 }
			],
			threshold: 0.4,
			includeMatches: POST_SEARCH_FZF
		})
	);

	let searchDisplay = $derived(
		searchQuery.length > 0
			? fuse.search(searchQuery)
			: data.posts.map((p) => ({ item: p, matches: [] }))
	);
</script>

<div class="space-y-8">
	<section class="border-border flex flex-col items-center rounded-lg border bg-muted/40 p-8">
		<h1 class="text-center text-4xl font-bold tracking-tight">Blog</h1>
		<div class="mt-2 text-center">
			<sub class="text-muted-foreground contents">
				A collection of blogs ranging from all sorts of topics.
			</sub>
		</div>

		<div
			class="border-border bg-background mt-6 flex w-full max-w-md items-center gap-2 rounded-full border px-2 py-1"
		>
			<span
				class="flex size-10 items-center justify-center text-xl leading-none"
				style="transform: translateX(-2px);"
			>
				
			</span>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search posts..."
				class="placeholder:text-muted-foreground w-full border-0 bg-transparent ring-0 outline-none focus:border-0 focus:ring-0 focus:outline-none"
			/>
		</div>
	</section>

	<section class="grid gap-6 md:grid-cols-2">
		{#each searchDisplay as result (result.item.slug)}
			{@const post = result.item}
			<div class="border-border rounded-lg border p-6 transition-all">
				<h2 class="text-xl font-semibold">
					<a class="text-xl underline hover:text-primary" href={`/blog/${post.slug}`}>
						<Highlight
							text={post.metadata.title}
							matches={result.matches}
							path={postKey('metadata.title')}
						/>
					</a>
				</h2>
				<p class="text-muted-foreground mt-2">
					<Highlight
						text={post.metadata.summary}
						matches={result.matches}
						path={postKey('metadata.summary')}
					/>
				</p>
			</div>
		{:else}
			<div class="col-span-full py-10 text-center text-muted-foreground">
				No posts found matching "{searchQuery}"
			</div>
		{/each}
	</section>
</div>
