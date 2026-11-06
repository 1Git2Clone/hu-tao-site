/**
 * The part of a graph layout the browser needs up front: sizes, and reading
 * positions back out of a simulation. d3-force stays in `graph-layout.ts`,
 * which the page only loads once a node is dragged.
 */
import type {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3-force";

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Positions = Record<string, Point>;
/** A settled picture: the viewBox it was laid out for, and where each node sits in it. */
export type Layout = { size: Size; positions: Positions };

/** Nodes render `text-sm` in a monospace font, so a label's width is known without measuring. */
export const NODE_HEIGHT = 32;
const CHAR_WIDTH = 0.6 * 14;
const PADDING_X = 13;
export const boxWidth = (label: string) =>
  Math.ceil(label.length * CHAR_WIDTH + 2 * PADDING_X);

/** d3 leaves x and y optional until it places a node; every node here starts placed. */
export type ForceNode = SimulationNodeDatum &
  Point & { id: string; halfWidth: number };
export type ForceSimulation = Simulation<
  ForceNode,
  SimulationLinkDatum<ForceNode>
>;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Box centres, keyed by node id, to a tenth of a pixel so the page data stays small. */
const tenth = (value: number) => Math.round(value * 10) / 10;
export const positionsOf = (simulation: ForceSimulation): Positions =>
  Object.fromEntries(
    simulation
      .nodes()
      .map(({ id, x, y }) => [id, { x: tenth(x), y: tenth(y) }]),
  );
