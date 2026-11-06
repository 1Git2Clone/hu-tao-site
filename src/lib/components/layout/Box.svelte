<script lang="ts">
  let { children } = $props<{ children: import("svelte").Snippet }>();
</script>

<div class="border-border box-gradient rounded-lg border p-8">
  {@render children()}
</div>
