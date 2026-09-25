<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	import NodeBox from './NodeBox.svelte';
	import NodeDetails from './NodeDetails.svelte';
	import {
		NODE_HEIGHT,
		boxWidth,
		clamp,
		createSimulation,
		positionsOf,
		type ForceSimulation,
		type Layout
	} from '$lib/data/graph-layout';
	import type { Graph, OverviewNode } from '$lib/types/infra-graph';

	let {
		graph,
		layout,
		selectedId = $bindable(null),
		class: className
	}: {
		graph: Graph<OverviewNode>;
		/** Settled on the server, so its picture is the one the page first paints. */
		layout: Layout;
		selectedId?: string | null;
		class?: string;
	} = $props();

	const size = untrack(() => layout.size);
	let positions = $state.raw(untrack(() => layout.positions));
	let hoveredId = $state<string | null>(null);
	const focusId = $derived(hoveredId ?? selectedId);
	const selected = $derived(graph.nodes.find((node) => node.id === selectedId));
	const lit = $derived(
		new Set(
			graph.links
				.filter(({ source, target }) => source === focusId || target === focusId)
				.flatMap(({ source, target }) => [source, target])
				.concat(focusId ?? [])
		)
	);

	let svg: SVGSVGElement;
	// Only a drag needs physics, so the simulation starts on the first one.
	let simulation: ForceSimulation | undefined;
	let drag: { id: string; x: number; y: number } | null = null;
	let dragged = false;

	onDestroy(() => simulation?.stop());

	// Dragging is for mice and pens. A finger on the graph belongs to the page: it scrolls,
	// and a tap is a click. Browsers ignore touch-action inside an SVG, so there is no
	// way to claim a finger for a node without also trapping the page's scroll.
	function onpointerdown(event: PointerEvent, id: string) {
		if (event.pointerType === 'touch') return;
		(event.currentTarget as Element).setPointerCapture(event.pointerId);
		drag = { id, x: event.clientX, y: event.clientY };
		dragged = false;
	}

	function onpointermove(event: PointerEvent) {
		if (!drag) return;
		if (!dragged && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 4) return;
		dragged = true;
		simulation ??= createSimulation(graph, size, positions).on(
			'tick',
			() => (positions = positionsOf(simulation!))
		);
		const node = simulation.nodes().find(({ id }) => id === drag!.id)!;
		const { x, y } = new DOMPoint(event.clientX, event.clientY).matrixTransform(
			svg.getScreenCTM()!.inverse()
		);
		node.fx = clamp(x, node.halfWidth, size.width - node.halfWidth);
		node.fy = clamp(y, NODE_HEIGHT / 2, size.height - NODE_HEIGHT / 2);
		simulation.alphaTarget(0.3).restart();
	}

	function onpointerup() {
		const node = simulation?.nodes().find(({ id }) => id === drag?.id);
		if (node) node.fx = node.fy = null;
		drag = null;
		if (!simulation) return;
		simulation.alphaTarget(0);
		if (prefersReducedMotion.current) {
			simulation.stop().tick(300);
			positions = positionsOf(simulation);
		}
	}

	function toggle(id: string) {
		selectedId = selectedId === id ? null : id;
	}

	function onclick(id: string) {
		if (dragged) return void (dragged = false);
		toggle(id);
	}

	function onkeydown(event: KeyboardEvent, id: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		toggle(id);
	}
</script>

<div class={['relative select-none', className]}>
	<svg
		bind:this={svg}
		viewBox="0 0 {size.width} {size.height}"
		class="block h-auto w-full"
		role="group"
		aria-label="Infrastructure overview"
	>
		{#each graph.links as { source, target } (`${source}→${target}`)}
			{@const hot = source === focusId || target === focusId}
			<line
				x1={positions[source].x}
				y1={positions[source].y}
				x2={positions[target].x}
				y2={positions[target].y}
				class={[
					'transition-[stroke,stroke-width,opacity] duration-200',
					hot ? 'stroke-accent stroke-2' : 'stroke-tertiary',
					focusId && !hot && 'opacity-30'
				]}
			/>
		{/each}

		{#each graph.nodes as node (node.id)}
			{@const { x, y } = positions[node.id]}
			<g
				role="button"
				tabindex="0"
				aria-pressed={selectedId === node.id}
				transform="translate({x - boxWidth(node.label) / 2} {y - NODE_HEIGHT / 2})"
				class="group cursor-pointer outline-none [@media(pointer:fine)]:cursor-grab [@media(pointer:fine)]:active:cursor-grabbing"
				onpointerdown={(event) => onpointerdown(event, node.id)}
				{onpointermove}
				{onpointerup}
				onpointercancel={onpointerup}
				onclick={() => onclick(node.id)}
				onkeydown={(event) => onkeydown(event, node.id)}
				onpointerenter={() => (hoveredId = node.id)}
				onpointerleave={() => (hoveredId = null)}
				onfocus={() => (hoveredId = node.id)}
				onblur={() => (hoveredId = null)}
			>
				<NodeBox
					label={node.label}
					kind={node.kind}
					active={selectedId === node.id}
					dimmed={focusId !== null && !lit.has(node.id)}
				/>
			</g>
		{/each}
	</svg>

	<div aria-live="polite">
		{#if selected}
			{@const { x, y } = positions[selected.id]}
			{#key selected.id}
				{#if size.width > size.height}
					<!-- Wide: the top corner away from the node. -->
					<NodeDetails
						node={selected}
						onclose={() => (selectedId = null)}
						class={['top-2 w-72', x > size.width / 2 ? 'left-2' : 'right-2'].join(' ')}
					/>
				{:else}
					<!-- Tall, so on a phone: right under the node, or above it in the lower half,
					     so the panel is on screen where the finger just was. -->
					{@const gap = NODE_HEIGHT / 2 + 8}
					<NodeDetails
						node={selected}
						onclose={() => (selectedId = null)}
						class="inset-x-2"
						style={y > size.height / 2
							? `bottom: ${(1 - (y - gap) / size.height) * 100}%`
							: `top: ${((y + gap) / size.height) * 100}%`}
					/>
				{/if}
			{/key}
		{/if}
	</div>
</div>
