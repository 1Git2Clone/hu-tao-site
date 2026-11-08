// Report correctness: a single sample must never look statistically gated,
// and failed/incomplete results must not become successful dashboard cards.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const directory = mkdtempSync(path.join(tmpdir(), "performance-report-"));
const workload = JSON.parse(
  readFileSync(
    "performance/results/2026-11-07-regression-workloads.json",
    "utf8",
  ),
);
const lighthouse = JSON.parse(
  readFileSync("performance/results/2026-11-07-aa-lighthouse.json", "utf8"),
);
const render = () => {
  execFileSync(process.execPath, [
    "scripts/ci/performance-report.ts",
    directory,
    path.join(directory, "report"),
  ]);
  return readFileSync(path.join(directory, "report/index.html"), "utf8");
};
try {
  writeFileSync(
    path.join(directory, "workloads.json"),
    JSON.stringify(workload),
  );
  let html = render();
  assert.match(html, /Regression/);
  assert.match(html, /3,235\.083 ms/);
  assert.match(html, /2,193\.401 ms/);
  assert.equal((html.match(/<circle /g) ?? []).length, 20);

  lighthouse.kind = "lighthouse-smoke";
  lighthouse.timingReportOnly = true;
  lighthouse.verdicts = [];
  for (const s of Object.values(lighthouse.samples) as {
    base: number[];
    head: number[];
  }[]) {
    s.base = [];
    s.head = [s.head[0]];
  }
  lighthouse.budgets = [
    { name: "mobile / total bytes", value: 20, budget: 10 },
  ];
  writeFileSync(
    path.join(directory, "lighthouse.json"),
    JSON.stringify(lighthouse),
  );
  html = render();
  assert.equal((html.match(/<p class="status">Report only/g) ?? []).length, 16);
  assert.match(html, /Over budget/);

  workload.incomplete = true;
  workload.error = '<script>alert("bad")</script>';
  writeFileSync(
    path.join(directory, "workloads.json"),
    JSON.stringify(workload),
  );
  html = render();
  assert.match(html, /Incomplete run/);
  assert.doesNotMatch(html, /<p class="status">Regression/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;alert/);
} finally {
  rmSync(directory, { recursive: true });
}
console.log("performance report: regression, smoke and incomplete states pass");
