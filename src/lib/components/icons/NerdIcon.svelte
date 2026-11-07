<script lang="ts">
  import { NERD_ICONS, type NerdIconName } from "./nerd-icons";

  let {
    name,
    width = 28,
    height = 28,
  }: {
    name: NerdIconName;
    width?: number | string;
    height?: number | string;
  } = $props();

  const icon = $derived(NERD_ICONS[name]);
</script>

<!-- A Nerd Font glyph as an SVG, drawn in the text colour. -->
<svg viewBox={icon.viewBox} {width} {height} fill="currentColor">
  <path d={icon.d} />
</svg>
