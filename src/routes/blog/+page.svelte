<script>
	export let data;
</script>

<h1 class="mb-6 text-3xl font-bold">Blog</h1>

<ul class="space-y-4">
	{#each data.posts as post}
		<li>
			<a class="text-xl underline" href={`/blog/${post.slug}`}>
				{post.title}
			</a>
		</li>
	{/each}
</ul>
