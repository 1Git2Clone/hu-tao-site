<script lang="ts">
  let {
    width = 28,
    height = 28,
  }: { width?: number | string; height?: number | string } = $props();
</script>

<!-- A small dot: the icon for a link with no logo of its own. -->
<svg viewBox="0 0 24 24" {width} {height} fill="currentColor">
  <circle cx="12" cy="12" r="3" />
</svg>
