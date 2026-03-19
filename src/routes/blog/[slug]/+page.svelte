<script lang="ts">
	export let data;
</script>

<svelte:component this={data.component} snippets={data.snippets} metadata={data.metadata} />
