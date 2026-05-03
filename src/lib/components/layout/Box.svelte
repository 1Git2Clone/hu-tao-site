<script lang="ts">
	let { children } = $props<{ children: import('svelte').Snippet }>();
</script>

<div class="border-border rounded-lg border box-gradient p-8">
	{@render children()}
</div>
