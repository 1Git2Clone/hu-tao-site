<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	import NodeBox from './NodeBox.svelte';
	import NodeDetails from './NodeDetails.svelte';
	import {
		NODE_HEIGHT,
		boxWidth,
		clamp,
		positionsOf,
		type ForceSimulation,
		type Layout
	} from '$lib/data/graph-geometry';
	import type { Graph, OverviewNode } from '$lib/types/infra-graph';

	let {
		graph,
		layout,
		selectedId = $bindable(),
		class: className
	}: {
		graph: Graph<OverviewNode>;
		/** Settled on the server, so its picture is the one the page first paints. */
		layout: Layout;
		selectedId?: string;
		class?: string;
	} = $props();

	const size = untrack(() => layout.size);
	let positions = $state.raw(untrack(() => layout.positions));
	let hoveredId = $state<string>();
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
	// Made on the first drag, so d3-force loads then rather than with the page: most visits
	// never drag, and a finger never does. It pushes the other nodes out of the way and settles.
	let simulation: Promise<ForceSimulation> | undefined;
	const simulate = () =>
		(simulation ??= import('$lib/data/graph-layout').then(({ createSimulation }) => {
			const created = createSimulation(graph, size, layout.positions);
			return created.on('tick', () => (positions = positionsOf(created)));
		}));
	let pressedAt = { x: 0, y: 0 };
	let dragged = false;

	onDestroy(() => void simulation?.then((running) => running.stop()));

	// Dragging is for mice and pens. A finger on the graph belongs to the page: it scrolls,
	// and a tap is a click. Browsers ignore touch-action inside an SVG, so there is no
	// way to claim a finger for a node without also trapping the page's scroll.
	// While a node holds the pointer capture, it is being dragged.
	function onpointerdown(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		(event.currentTarget as Element).setPointerCapture(event.pointerId);
		pressedAt = { x: event.clientX, y: event.clientY };
		dragged = false;
	}

	// A node's simulation twin sits at the same index: createSimulation maps graph.nodes in order.
	function onpointermove(event: PointerEvent, index: number) {
		if (!(event.currentTarget as Element).hasPointerCapture(event.pointerId)) return;
		const { clientX, clientY } = event;
		if (!dragged && Math.hypot(clientX - pressedAt.x, clientY - pressedAt.y) < 4) return;
		dragged = true;
		const rect = svg.getBoundingClientRect();
		const x = ((clientX - rect.left) / rect.width) * size.width;
		const y = ((clientY - rect.top) / rect.height) * size.height;
		void simulate().then((running) => {
			const node = running.nodes()[index];
			node.fx = clamp(x, node.halfWidth, size.width - node.halfWidth);
			node.fy = clamp(y, NODE_HEIGHT / 2, size.height - NODE_HEIGHT / 2);
			running.alphaTarget(0.3).restart();
		});
	}

	function onpointerup(event: PointerEvent, index: number) {
		if (!(event.currentTarget as Element).hasPointerCapture(event.pointerId)) return;
		// A press that never became a drag has no simulation to let go of.
		void simulation?.then((running) => {
			const node = running.nodes()[index];
			node.fx = node.fy = undefined;
			running.alphaTarget(0);
			if (prefersReducedMotion.current) {
				running.stop().tick(300);
				positions = positionsOf(running);
			}
		});
	}

	function toggle(id: string) {
		selectedId = selectedId === id ? undefined : id;
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

		{#each graph.nodes as node, index (node.id)}
			{@const { x, y } = positions[node.id]}
			<g
				role="button"
				tabindex="0"
				aria-pressed={selectedId === node.id}
				transform="translate({x - boxWidth(node.label) / 2} {y - NODE_HEIGHT / 2})"
				class="group cursor-pointer outline-none pointer-fine:cursor-grab pointer-fine:active:cursor-grabbing"
				{onpointerdown}
				onpointermove={(event) => onpointermove(event, index)}
				onpointerup={(event) => onpointerup(event, index)}
				onpointercancel={(event) => onpointerup(event, index)}
				onclick={() => onclick(node.id)}
				onkeydown={(event) => onkeydown(event, node.id)}
				onpointerenter={() => (hoveredId = node.id)}
				onpointerleave={() => (hoveredId = undefined)}
				onfocus={() => (hoveredId = node.id)}
				onblur={() => (hoveredId = undefined)}
			>
				<NodeBox
					label={node.label}
					kind={node.kind}
					active={selectedId === node.id}
					dimmed={focusId !== undefined && !lit.has(node.id)}
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
						onclose={() => (selectedId = undefined)}
						class={['top-2 w-72', x > size.width / 2 ? 'left-2' : 'right-2'].join(' ')}
					/>
				{:else}
					<!-- Tall, so on a phone: right under the node, or above it in the lower half,
					     so the panel is on screen where the finger just was. -->
					{@const gap = NODE_HEIGHT / 2 + 8}
					<NodeDetails
						node={selected}
						onclose={() => (selectedId = undefined)}
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
