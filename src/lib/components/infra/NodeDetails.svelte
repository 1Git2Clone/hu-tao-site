<script lang="ts">
	import { fly } from 'svelte/transition';

	import type { OverviewNode } from '$lib/types/infra-graph';

	/** `class` and `style` place the panel; the caller keeps it clear of the node. */
	let {
		node,
		onclose,
		class: placement,
		style
	}: { node: OverviewNode; onclose: () => void; class: string; style?: string } = $props();
</script>

<div
	transition:fly={{ y: 12, duration: 200 }}
	class={['card absolute z-10 rounded-lg p-4', placement]}
	{style}
>
	<div class="flex items-start justify-between gap-4">
		<h3 class="m-0 text-lg font-semibold text-subtextcol">{node.label}</h3>
		<button type="button" aria-label="Close" onclick={onclose} class="-m-1 p-1">
			<svg viewBox="0 0 16 16" class="size-4 stroke-current stroke-2" aria-hidden="true">
				<path d="M3 3l10 10M13 3L3 13" />
			</svg>
		</button>
	</div>
	<div class="prose prose-sm mt-2 text-left dark:prose-invert [&_p]:my-0">
		{@html node.description}
	</div>
</div>
