<script lang="ts">
  let {
    width = 28,
    height = 28,
  }: { width?: number | string; height?: number | string } = $props();
</script>

<!-- Hetzner logo (Simple Icons 16.36.0, CC0), drawn in the text colour. -->
<!-- Padded viewBox: the mark fills ~83% of the box, like the Nerd Font icons. -->
<svg
  viewBox="-2.46 -2.46 28.92 28.92"
  {width}
  {height}
  fill="currentColor"
  aria-label="Hetzner"
>
  <path
    d="M0 0v24h24V0H0zm4.602 4.025h2.244c.509 0 .716.215.716.717v5.64h8.883v-5.64c0-.509.215-.717.717-.717h2.229c.5 0 .71.23.724.717v14.516c0 .509-.215.717-.717.717h-2.23c-.51 0-.717-.215-.717-.717v-5.735H7.562v5.735c0 .516-.215.717-.716.717H4.602c-.51 0-.717-.208-.717-.717V4.742c0-.509.207-.717.717-.717z"
  />
</svg>
