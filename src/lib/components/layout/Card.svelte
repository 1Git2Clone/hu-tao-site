<script lang="ts">
  let { children }: { children: import("svelte").Snippet } = $props();
</script>

<div class="border-border card size-full border p-6">
  {@render children()}
</div>
