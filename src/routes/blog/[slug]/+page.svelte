<script lang="ts">
	let { data } = $props();

	const snippetMap = $derived(
		(data.snippets || []).reduce((acc: Record<string, any>, s) => {
			acc[s.file] = s;
			return acc;
		}, {})
	);
</script>

<data.component fetchedSnippets={snippetMap} metadata={data.metadata} />
