/**
 * The statistics behind the timing gates. Pure, so
 * `scripts/checks/performance.ts` can test them under plain Node.
 *
 * A gate compares samples of the baseline commit (`base`) with samples of the
 * checked-out code (`head`), taken in turn on the same machine. A timing
 * regresses only when both hold:
 *
 * - It is consistent. A one-sided exact permutation test (Mann–Whitney) asks
 *   how often a random relabelling of the same samples looks at least as slow.
 *   `ALPHA` is the accepted chance that one gate run fails with no real
 *   change, shared by every timing the run tests (Holm's method).
 * - It is bigger than ordinary noise. The floor is how far two medians of the
 *   same code moved apart in a recorded A/A run (see `floor`), so a real but
 *   tiny change does not fail. It is in the metric's own unit, not a share:
 *   a TBT or CLS of 0 has no relative change.
 */

/** The accepted family-wise false-failure rate of one gate run. */
export const ALPHA = 0.01;

/** C(2n, n) relabellings are tried; 10 runs per side is 184 756 of them. */
export const MAX_RUNS = 10;

export const median = (values: readonly number[]): number => {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** Every way to pick `k` of `n` indices, in lexicographic order. */
function* choose(n: number, k: number): Generator<number[]> {
  const picked = Array.from({ length: k }, (_, i) => i);
  while (true) {
    yield picked;
    let i = k - 1;
    while (i >= 0 && picked[i] === n - k + i) i--;
    if (i < 0) return;
    picked[i]++;
    for (let j = i + 1; j < k; j++) picked[j] = picked[j - 1] + 1;
  }
}

/** Every split of the pooled samples into a base and a head of the same sizes. */
function* relabellings(base: readonly number[], head: readonly number[]) {
  if (base.length !== head.length || base.length < 2 || base.length > MAX_RUNS)
    throw new Error(`need 2 to ${MAX_RUNS} runs per side, the same on both`);
  const pooled = [...base, ...head];
  for (const picked of choose(pooled.length, head.length)) {
    const chosen = new Set(picked);
    yield {
      picked,
      base: pooled.filter((_, i) => !chosen.has(i)),
      head: picked.map((i) => pooled[i]),
    };
  }
}

/** The smallest p-value `runs` samples per side can give: 1 / C(2n, n). */
export const smallestP = (runs: number): number => {
  let c = 1;
  for (let i = 1; i <= runs; i++) c = (c * (runs + i)) / i;
  return 1 / Math.round(c);
};

/**
 * Throws when `cells` timings with `runs` samples per side could never fail:
 * Holm tests the smallest p-value at ALPHA / cells.
 */
export function assertPower(runs: number, cells: number, alpha = ALPHA) {
  if (smallestP(runs) > alpha / cells)
    throw new Error(
      `${runs} runs per side cannot fail any of ${cells} timings at alpha ${alpha}: ` +
        `the smallest p-value is ${smallestP(runs).toPrecision(3)}, ` +
        `above ${(alpha / cells).toPrecision(3)}`,
    );
}

/**
 * The one-sided permutation p-value of "head is larger than base", from the
 * sum of head's ranks (an exact Mann–Whitney test). Ranks keep one stray slow
 * run from deciding the result. Exact, so the same samples always give the
 * same p-value.
 */
export function permutationP(
  base: readonly number[],
  head: readonly number[],
): number {
  const pooled = [...base, ...head];
  const sorted = pooled.toSorted((a, b) => a - b);
  // Tied values share the mean of their ranks.
  const ranks = pooled.map(
    (value) => (sorted.indexOf(value) + sorted.lastIndexOf(value)) / 2,
  );
  const sum = (indices: readonly number[]) =>
    indices.reduce((total, i) => total + ranks[i], 0);
  const observed = sum(head.map((_, i) => base.length + i));
  let atLeast = 0;
  let total = 0;
  for (const { picked } of relabellings(base, head)) {
    if (sum(picked) >= observed - 1e-9) atLeast++;
    total++;
  }
  return atLeast / total;
}

/** How much the median grew, in the metric's unit. */
export const delta = (base: readonly number[], head: readonly number[]) =>
  median(head) - median(base);

/**
 * The noise floor of one metric, from an A/A run: two sets of samples of the
 * same code. Of every way to split those samples into two sides, the share
 * `1 - alpha` move their medians apart by no more than this, in the metric's
 * unit. A timing must move further than that before it can fail. Samples
 * that never vary give 0, never Infinity.
 */
export function floor(
  a: readonly number[],
  b: readonly number[],
  alpha = ALPHA,
): number {
  if ([...a, ...b].some((value) => !Number.isFinite(value) || value < 0))
    throw new Error("noise floors require finite nonnegative samples");
  const moves = Array.from(relabellings(a, b), (split) =>
    Math.abs(delta(split.base, split.head)),
  ).toSorted((x, y) => x - y);
  return moves[
    Math.min(moves.length - 1, Math.ceil((1 - alpha) * moves.length))
  ];
}

export interface Cell {
  /** For example `mobile / lcp` or `infra-layout ms`. */
  name: string;
  base: readonly number[];
  head: readonly number[];
  /** From `floor`, recorded in performance/baseline.json. */
  floor: number;
}

export interface Verdict {
  name: string;
  base: number;
  head: number;
  /** head - base, from the medians, in the metric's unit. */
  delta: number;
  floor: number;
  p: number;
  /** The level `p` had to reach, after Holm's correction. */
  level: number;
  regressed: boolean;
}

/** Judges every timing. They share `alpha` by Holm's step-down method. */
export function judge(cells: readonly Cell[], alpha = ALPHA): Verdict[] {
  for (const cell of cells) {
    if (cell.floor < 0) throw new Error(`${cell.name}: negative noise floor`);
    for (const value of [...cell.base, ...cell.head, cell.floor])
      if (!Number.isFinite(value))
        throw new Error(`${cell.name}: measured ${value}`);
  }
  const verdicts = cells.map((cell): Verdict => ({
    name: cell.name,
    base: median(cell.base),
    head: median(cell.head),
    delta: delta(cell.base, cell.head),
    floor: cell.floor,
    p: permutationP(cell.base, cell.head),
    level: 0,
    regressed: false,
  }));

  // Holm: the k-th smallest p-value is tested at alpha / (m - k), and testing
  // stops at the first one that passes.
  const tested = verdicts.toSorted((a, b) => a.p - b.p);
  let significant = true;
  for (const [k, verdict] of tested.entries()) {
    verdict.level = alpha / (tested.length - k);
    significant &&= verdict.p <= verdict.level;
    verdict.regressed = significant && verdict.delta > verdict.floor;
  }
  return verdicts;
}

/** The order that cancels a steady drift in machine speed: B H H B, B H H B, … */
export const abba = (runs: number): ("base" | "head")[] =>
  Array.from({ length: runs }, (_, i): ("base" | "head")[] =>
    i % 2 ? ["head", "base"] : ["base", "head"],
  ).flat();

const signed = (x: number) => `${x >= 0 ? "+" : ""}${+x.toFixed(3)}`;

export const table = (verdicts: readonly Verdict[]): string =>
  verdicts
    .map((v) =>
      [
        v.regressed ? "FAIL" : "ok  ",
        v.name.padEnd(30),
        String(+v.base.toFixed(3)).padStart(10),
        String(+v.head.toFixed(3)).padStart(10),
        signed(v.delta).padStart(10),
        `floor ${+v.floor.toFixed(3)}`.padStart(14),
        `  p=${v.p.toPrecision(3)} level=${v.level.toPrecision(3)}`,
      ].join(" "),
    )
    .join("\n");
