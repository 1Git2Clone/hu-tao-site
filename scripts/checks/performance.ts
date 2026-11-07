// Run: node scripts/checks/performance.ts
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isNoMatch, markerPattern, run } from "./performance-run.ts";
import {
  ALPHA,
  abba,
  assertPower,
  floor,
  judge,
  median,
  permutationP,
  smallestP,
} from "./performance-stats.ts";

assert.equal(median([3, 1, 2]), 2);
assert.equal(median([4, 1, 3, 2]), 2.5);

// B H H B, so a machine that slows down steadily slows both sides alike.
assert.deepEqual(abba(3), ["base", "head", "head", "base", "base", "head"]);

// Exact: a complete separation of six runs per side is 1 / C(12, 6).
const noise = [0, 3, -2, 1, -3, 2];
const at = (shift: number, n = noise) => n.map((x) => 100 + shift + x);
assert.equal(smallestP(6), 1 / 924);
assert.equal(smallestP(7), 1 / 3432);
assert.equal(permutationP(at(0), at(10)), 1 / 924);
assert.ok(permutationP(at(0), at(0)) > 0.4);

// The same samples split every way: the floor sits between their spread and 0.
const aa = floor(at(0), at(0, noise.toReversed()));
assert.ok(aa > 0 && aa < 6, `floor ${aa}`);
// A metric that is 0 on most runs gives a finite floor, in its own unit.
assert.equal(floor([0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]), 0);
assert.ok(Number.isFinite(floor([0, 0, 0, 0, 0, 12], [0, 0, 0, 0, 0, 0])));
assert.throws(() => floor([0, NaN], [0, 0]));
assert.throws(() => floor([0, 0], [-1, 0]));

// A zero baseline remains testable in physical units, including with Holm.
const zeroTimings = Array.from({ length: 16 }, (_, i) => ({
  name: `zero timing ${i}`,
  base: Array<number>(7).fill(0),
  head: Array<number>(7).fill(i === 0 ? 40 : 0),
  floor: 17,
}));
assert.ok(judge(zeroTimings)[0].regressed, "0 to 40 ms must remain detectable");
assert.ok(
  !judge([{ ...zeroTimings[0], head: [40, 0, 0, 0, 0, 0, 0] }])[0].regressed,
);
assert.ok(
  judge([{ ...zeroTimings[0], head: Array<number>(7).fill(0.01), floor: 0 }])[0]
    .regressed,
);

// A regression bigger than the noise fails. One inside the noise does not,
// and neither does a consistent one below the recorded floor.
const cell = (shift: number, cellFloor = 1) => ({
  name: `+${shift}`,
  base: at(0),
  head: at(shift),
  floor: cellFloor,
});
const [clear] = judge([cell(20)]);
assert.ok(clear.regressed && clear.p <= ALPHA, "a 20% slowdown passed");
assert.ok(!judge([cell(1)])[0].regressed, "a change inside the noise failed");
assert.ok(
  !judge([cell(20, 25)])[0].regressed,
  "a change under the floor failed",
);
assert.ok(
  !judge([{ ...cell(0), head: at(-20) }])[0].regressed,
  "faster failed",
);

// Constant timings stay timings: 1 ms more on every run is under any floor.
const constant = { name: "constant", base: [5, 5, 5, 5, 5, 5], floor: 0.01 };
assert.ok(
  !judge([{ ...constant, head: [5.001, 5.001, 5.001, 5.001, 5.001, 5.001] }])[0]
    .regressed,
);
assert.ok(judge([{ ...constant, head: [6, 6, 6, 6, 6, 6] }])[0].regressed);

// A missing or broken measurement is an error, never a pass.
assert.throws(() => judge([{ ...cell(0), head: [...at(0).slice(1), NaN] }]));
assert.throws(() => judge([{ ...cell(0), head: at(0).slice(1) }]));
assert.throws(() => judge([cell(0, -1)]));
assert.ok(!isNoMatch({ code: "ENOENT" }));
assert.ok(!isNoMatch({ status: 2, stderr: "invalid expression" }));
assert.ok(!isNoMatch({ status: 1, stderr: "permission denied" }));

// Holm shares ALPHA between cells: 1 / 924 passes as one cell of 20, where
// each must reach 0.01 / 20 = 0.0005, and fails as the only cell.
const many = Array.from({ length: 20 }, (_, i) => cell(i === 0 ? 20 : 0));
assert.ok(!judge(many)[0].regressed, "Holm did not correct for 20 cells");
assert.ok(judge(many.slice(0, 1))[0].regressed);

// Too few runs for the number of timings is refused, not run powerless.
assert.throws(() => assertPower(5, 3), /cannot fail/);
assert.doesNotThrow(() => assertPower(7, 16));
assert.throws(() => assertPower(6, 16), /cannot fail/);

// A timed-out run leaves nothing behind, even a process in another group
// (as chrome-launcher starts Chrome), when that process carries the marker.
const marker = `--performance-check=${randomUUID()}`;
const alive = () => {
  try {
    execFileSync("pgrep", ["-f", "--", markerPattern(marker)]);
    return true;
  } catch (error) {
    if (isNoMatch(error)) return false;
    throw error;
  }
};
const directory = mkdtempSync(path.join(tmpdir(), "performance-cleanup-"));
const ready = path.join(directory, "ready");
// The grandchild records its PID before hanging. A slow startup cannot make
// the test pass without ever creating the process it promises to clean up.
const grandchild = `require("node:fs").writeFileSync(process.argv[1], String(process.pid)); setTimeout(() => {}, 300000);`;
const hang = `require("node:child_process").spawn(process.execPath, ["-e", ${JSON.stringify(grandchild)}, "--", process.argv[2], process.argv[1]], { detached: true, stdio: "ignore" }).unref(); setInterval(() => {}, 1000);`;
const sibling = spawn(
  process.execPath,
  ["-e", "setTimeout(() => {}, 300000)", "--", `${marker}0`],
  { stdio: "ignore" },
);
try {
  await assert.rejects(
    run(process.execPath, ["-e", hang, "--", marker, ready], {
      cwd: ".",
      timeout: 2000,
      marker,
      grace: 200,
    }),
    /timed out/,
  );
  assert.ok(existsSync(ready), "the detached process never started");
  assert.ok(!alive(), "a timed-out run left a marked process running");
  assert.equal(sibling.exitCode, null, "cleanup matched a longer marker");
  assert.equal(sibling.signalCode, null, "cleanup killed a longer marker");
} finally {
  sibling.kill("SIGKILL");
  if (existsSync(ready)) {
    try {
      process.kill(-Number(readFileSync(ready, "utf8")), "SIGKILL");
    } catch {}
  }
  rmSync(directory, { recursive: true });
}
