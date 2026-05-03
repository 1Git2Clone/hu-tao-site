<script lang="ts">
	let { children } = $props<{ children: import('svelte').Snippet }>();
</script>

<div class="border-border card rounded-lg border p-6">
	{@render children()}
</div>
