// Run: node scripts/check-infra-graph.ts
import assert from "node:assert/strict";
import { OVERVIEW, OVERVIEW_SIZES } from "../src/lib/content/infra/topology.ts";
import { NODE_HEIGHT, boxWidth } from "../src/lib/data/graph-geometry.ts";
import { tangle, wideAndTall } from "../src/lib/data/graph-layout.ts";

// Ids are unique and every link names two of them.
const ids = new Set(OVERVIEW.nodes.map((node) => node.id));
assert.equal(ids.size, OVERVIEW.nodes.length, "duplicate node id");
for (const { source, target } of OVERVIEW.links) {
  assert.ok(ids.has(source), `link from unknown node "${source}"`);
  assert.ok(ids.has(target), `link to unknown node "${target}"`);
}

// Each layout the page ships keeps every box inside the viewBox, clear of the
// others, draws no two links across each other, and leaves no big hole.
for (const [name, { size, positions }] of Object.entries(
  wideAndTall(OVERVIEW, OVERVIEW_SIZES),
)) {
  const boxes = OVERVIEW.nodes.map(({ id, label }) => ({
    id,
    w: boxWidth(label),
    ...positions[id],
  }));
  for (const box of boxes) {
    assert.ok(
      box.x - box.w / 2 >= -1 && box.x + box.w / 2 <= size.width + 1,
      `${box.id} spills sideways in ${name}`,
    );
    assert.ok(
      box.y - NODE_HEIGHT / 2 >= -1 &&
        box.y + NODE_HEIGHT / 2 <= size.height + 1,
      `${box.id} spills vertically in ${name}`,
    );
  }
  const { overlaps, crossings } = tangle(OVERVIEW, positions);
  assert.equal(overlaps, 0, `boxes overlap in ${name}`);
  assert.equal(crossings, 0, `links cross in ${name}`);

  // Cut the box into 18 cells along its long side; at most two may sit empty.
  const [cols, rows] = size.width > size.height ? [6, 3] : [3, 6];
  const cell = ({ x, y }: { x: number; y: number }) =>
    `${Math.min(cols - 1, Math.floor((x / size.width) * cols))},${Math.min(rows - 1, Math.floor((y / size.height) * rows))}`;
  const empty = cols * rows - new Set(boxes.map(cell)).size;
  assert.ok(empty <= 2, `${empty} of ${cols * rows} cells empty in ${name}`);
}

console.log("infra graph: all checks passed");
