<script lang="ts">
	let { data } = $props();
</script>

<data.component fetchedSnippets={data.snippets} metadata={data.metadata} />
