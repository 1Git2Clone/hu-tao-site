<script lang="ts">
	let { width = 28, height = 28 }: { width?: number | string; height?: number | string } = $props();
</script>

<!-- Forgejo logo (forgejo.org, CC BY-SA 4.0), monochrome. -->
<!-- Padded viewBox: the mark fills ~83% of the box, like the GitHub icon. -->
<svg viewBox="-20.5 -20.5 253 253" {width} {height} aria-label="Forgejo">
	<g transform="translate(6 6)" fill="none" stroke="currentColor" stroke-width="25">
		<path d="M58 168V70a50 50 0 0 1 50-50h20" />
		<path d="M58 168v-30a50 50 0 0 1 50-50h20" />
		<circle cx="142" cy="20" r="18" stroke-width="15" />
		<circle cx="142" cy="88" r="18" stroke-width="15" />
		<circle cx="58" cy="180" r="18" stroke-width="15" />
	</g>
</svg>
