<script lang="ts">
	import { NODE_HEIGHT, boxWidth } from '$lib/data/graph-geometry';
	import type { NodeKind } from '$lib/types/infra-graph';

	let {
		label,
		kind,
		active = false,
		dimmed = false
	}: { label: string; kind: NodeKind; active?: boolean; dimmed?: boolean } = $props();

	const width = $derived(boxWidth(label));
</script>

<!-- The box a node draws, in SVG units with its top-left at the origin. -->
<g class={['transition-opacity duration-200', dimmed && 'opacity-35']}>
	<rect
		{width}
		height={NODE_HEIGHT}
		rx="8"
		class={[
			'transition-[fill,stroke] duration-200 group-hover:stroke-accent-hover group-focus-visible:stroke-accent-hover group-focus-visible:stroke-2',
			kind === 'infra' ? 'stroke-tertiary' : 'stroke-accent',
			kind === 'private' && '[stroke-dasharray:4_3]',
			active ? 'fill-accent' : 'fill-muted'
		]}
	/>
	<text
		x={width / 2}
		y={NODE_HEIGHT / 2}
		dominant-baseline="central"
		text-anchor="middle"
		class={['text-sm transition-[fill] duration-200', active ? 'fill-muted' : 'fill-textcol']}
	>
		{label}
	</text>
</g>
