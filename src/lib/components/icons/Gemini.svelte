<script lang="ts">
  let {
    width = 28,
    height = 28,
  }: { width?: number | string; height?: number | string } = $props();
</script>

<!-- Google Gemini logo (Simple Icons 16.36.0, CC0), drawn in the text colour. -->
<!-- Padded viewBox: the mark fills ~83% of the box, like the Nerd Font icons. -->
<svg
  viewBox="-2.46 -2.46 28.92 28.92"
  {width}
  {height}
  fill="currentColor"
  aria-label="Google Gemini"
>
  <path
    d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
  />
</svg>
