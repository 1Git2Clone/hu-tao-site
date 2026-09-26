/**
 * Graph layouts. Pure, so the server places every node before any JS runs and
 * `scripts/check-infra-graph.ts` can run them under plain Node.
 */
import {
	forceLink,
	forceManyBody,
	forceSimulation,
	forceX,
	forceY,
	type SimulationLinkDatum
} from 'd3-force';
import type { Graph } from '../types/infra-graph';
import {
	NODE_HEIGHT,
	boxWidth,
	clamp,
	positionsOf,
	type ForceNode,
	type ForceSimulation,
	type Layout,
	type Point,
	type Positions,
	type Size
} from './graph-geometry.ts';

const GAP = 10;

/** d3's forceCollide is for circles; these boxes are wide and short. */
// ponytail: O(n²) pairs, fine for the dozen overview nodes; quadtree if it ever holds hundreds.
function forceBoxCollide() {
	let nodes: ForceNode[] = [];
	const force = () => {
		for (const [i, a] of nodes.entries()) {
			for (const b of nodes.slice(i + 1)) {
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const overlapX = a.halfWidth + b.halfWidth + GAP - Math.abs(dx);
				const overlapY = NODE_HEIGHT + GAP - Math.abs(dy);
				if (overlapX <= 0 || overlapY <= 0) continue;
				// Part along whichever axis needs the smaller push.
				if (overlapX < overlapY) {
					const push = (overlapX / 2) * (Math.sign(dx) || 1);
					a.x -= push;
					b.x += push;
				} else {
					const push = (overlapY / 2) * (Math.sign(dy) || 1);
					a.y -= push;
					b.y += push;
				}
			}
		}
	};
	force.initialize = (all: ForceNode[]) => (nodes = all);
	return force;
}

/** Keeps every box inside the container. */
function forceBounds({ width, height }: Size) {
	let nodes: ForceNode[] = [];
	const force = () => {
		for (const node of nodes) {
			node.x = clamp(node.x, node.halfWidth, width - node.halfWidth);
			node.y = clamp(node.y, NODE_HEIGHT / 2, height - NODE_HEIGHT / 2);
		}
	};
	force.initialize = (all: ForceNode[]) => (nodes = all);
	return force;
}

/** The graph's nodes as d3 wants them, in `graph.nodes` order, each starting at `start`. */
const forceNodes = (graph: Graph, start: Positions): ForceNode[] =>
	graph.nodes.map(({ id, label }) => ({ id, halfWidth: boxWidth(label) / 2, ...start[id] }));

/** A stopped simulation in a `size` box, with every node starting at `start`. */
export function createSimulation(graph: Graph, size: Size, start: Positions): ForceSimulation {
	const { width, height } = size;
	const links = graph.links.map((link) => ({ ...link }));

	// Pull harder along the short axis, so the graph spreads to the container's shape.
	return forceSimulation(forceNodes(graph, start))
		.force(
			'link',
			forceLink<ForceNode, SimulationLinkDatum<ForceNode>>(links)
				.id((node) => node.id)
				.distance(120)
		)
		.force('charge', forceManyBody().strength(-1200))
		.force('x', forceX(width / 2).strength((0.05 * height) / width))
		.force('y', forceY(height / 2).strength((0.05 * width) / height))
		.force('collide', forceBoxCollide())
		.force('bounds', forceBounds(size))
		.stop();
}

/** Runs a simulation to rest: 300 ticks is d3's own count from alpha 1 to alphaMin. */
export function settle(graph: Graph, size: Size, start: Positions): Positions {
	const simulation = createSimulation(graph, size, start);
	simulation.tick(300);
	return positionsOf(simulation);
}

/** What a picture of the graph gets wrong: boxes overlapping, links crossing, and links running through a box. */
export function tangle(graph: Graph, positions: Positions) {
	const side = (p: Point, q: Point, r: Point) =>
		Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
	const cross = (a: Point, b: Point, c: Point, d: Point) =>
		side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0;
	// ponytail: samples each link in 50 steps; exact segment-box clipping if that ever misses one.
	const throughBox = (a: Point, b: Point, box: Point, halfWidth: number) =>
		Array.from({ length: 49 }, (_, i) => (i + 1) / 50).some(
			(t) =>
				Math.abs(a.x + (b.x - a.x) * t - box.x) < halfWidth + 2 &&
				Math.abs(a.y + (b.y - a.y) * t - box.y) < NODE_HEIGHT / 2 + 2
		);

	const at = ({ source, target }: { source: string; target: string }) =>
		[positions[source], positions[target]] as const;
	let crossings = 0;
	for (const [i, one] of graph.links.entries()) {
		for (const other of graph.links.slice(i + 1)) {
			const shared = [one.source, one.target].some(
				(id) => id === other.source || id === other.target
			);
			if (!shared && cross(...at(one), ...at(other))) crossings++;
		}
	}
	let throughBoxes = 0;
	for (const link of graph.links) {
		for (const { id, label } of graph.nodes) {
			if (id === link.source || id === link.target) continue;
			if (throughBox(...at(link), positions[id], boxWidth(label) / 2)) throughBoxes++;
		}
	}
	let overlaps = 0;
	for (const [i, a] of graph.nodes.entries()) {
		for (const b of graph.nodes.slice(i + 1)) {
			const [p, q] = [positions[a.id], positions[b.id]];
			const apart =
				Math.abs(p.x - q.x) >= (boxWidth(a.label) + boxWidth(b.label)) / 2 - 1 ||
				Math.abs(p.y - q.y) >= NODE_HEIGHT - 1;
			if (!apart) overlaps++;
		}
	}
	return { overlaps, crossings, throughBoxes };
}

/**
 * The least tangled of `tries` layouts, each settled from its own scattered start.
 * Seeded, so every build picks the same one. Slow enough to belong on the server.
 */
export function untangled(graph: Graph, size: Size, tries = 200): Positions {
	let seed = 1;
	const random = () => (seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32;
	const scatter = () =>
		Object.fromEntries(
			graph.nodes.map(({ id }) => [
				id,
				{ x: size.width * (0.1 + 0.8 * random()), y: size.height * (0.1 + 0.8 * random()) }
			])
		);

	const tried = Array.from({ length: tries }, () => {
		const positions = settle(graph, size, scatter());
		const { overlaps, crossings, throughBoxes } = tangle(graph, positions);
		// Any overlap or crossing is worse than any number of links grazing a box.
		return { positions, score: (overlaps + crossings) * graph.links.length ** 2 + throughBoxes };
	});
	return tried.reduce((best, next) => (next.score < best.score ? next : best)).positions;
}

/**
 * `from` turned a quarter, stretched to `size`, then nudged until no boxes overlap.
 * A force layout settled in a narrow box piles against its walls; turning a wide one
 * keeps its even spread, and a rotation cannot add crossings.
 */
export function rotated(graph: Graph, from: Layout, size: Size): Positions {
	const start = Object.fromEntries(
		Object.entries(from.positions).map(([id, { x, y }]) => [
			id,
			{ x: (y / from.size.height) * size.width, y: (x / from.size.width) * size.height }
		])
	);
	// Boxes stay horizontal, so a few collide after the turn: only collision and bounds run.
	const simulation: ForceSimulation = forceSimulation(forceNodes(graph, start))
		.force('collide', forceBoxCollide())
		.force('bounds', forceBounds(size))
		.stop();
	simulation.tick(300);
	return positionsOf(simulation);
}

/** A wide layout for desktop, and the same picture turned upright for phones. */
export function wideAndTall(graph: Graph, sizes: { wide: Size; tall: Size }) {
	const wide: Layout = { size: sizes.wide, positions: untangled(graph, sizes.wide) };
	const tall: Layout = { size: sizes.tall, positions: rotated(graph, wide, sizes.tall) };
	return { wide, tall };
}
