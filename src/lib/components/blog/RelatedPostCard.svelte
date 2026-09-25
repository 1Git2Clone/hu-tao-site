<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RelatedPost } from '$lib/data/related';

	// No post means there is nothing related: the card says so.
	let { post }: { post?: RelatedPost } = $props();
</script>

{#if post}
	<!-- The box lives on the wrapper: `#main-content a` outranks any border class on an <a>. -->
	<div class="border-border card rounded-lg border text-left">
		<a href={resolve(`/blogs/${post.slug}`)} class="block p-4" style="border: 0;">
			<span class="block font-bold">{post.title}</span>
			<span class="mt-1 block text-xs text-subtextcol">{post.date} • {post.readingTime}</span>
		</a>
	</div>
{:else}
	<div class="border-border card rounded-lg border p-4 text-left text-sm text-subtextcol italic">
		Ain't Nobody Here but Us Chickens
	</div>
{/if}
