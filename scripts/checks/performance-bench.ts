// Compares the code in two checkouts on this machine, taking turns.
//
//   node scripts/checks/performance-bench.ts workloads <base> <head> [--runs N] [--out FILE]
//   node scripts/checks/performance-bench.ts lighthouse <base> <head> [--runs N] [--out FILE]
//   node scripts/checks/performance-bench.ts lighthouse-smoke <head> [--out FILE]
//   node scripts/checks/performance-bench.ts renderer <root> [--out FILE]
//   node scripts/checks/performance-bench.ts record <workloads.json> <lighthouse.json>
//
// <base> and <head> are checkout roots with their own node_modules. For
// `lighthouse`, the base must also hold a production build. The head is rebuilt.
// `workloads` and `lighthouse` exit 1 when a metric regressed. `renderer` only
// reports. `record` turns two A/A results into performance/baseline.json.
// performance/README.md explains the method.
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { killMarked, run } from "./performance-run.ts";
import {
  ALPHA,
  MAX_RUNS,
  abba,
  assertPower,
  floor,
  judge,
  table,
  type Cell,
} from "./performance-stats.ts";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { runs: { type: "string" }, out: { type: "string" } },
});
const [kind, ...roots] = positionals;
const smoke = kind === "lighthouse-smoke";
const BASELINE = path.join(
  import.meta.dirname,
  "../../performance/baseline.json",
);

/**
 * What Lighthouse loads. Mobile is what PageSpeed reports; one desktop run of
 * the homepage checks the other layout.
 */
const PROFILES = [
  { name: "mobile /", route: "/", flags: [] },
  { name: "mobile /blogs", route: "/blogs", flags: [] },
  {
    name: "mobile /blogs/intro-to-big-o-notation",
    route: "/blogs/intro-to-big-o-notation",
    flags: [],
  },
  { name: "desktop /", route: "/", flags: ["--preset=desktop"] },
] as const;

/** The gated Lighthouse timings. Lower is better for each. */
const AUDITS = {
  fcp: "first-contentful-paint",
  lcp: "largest-contentful-paint",
  tbt: "total-blocking-time",
  cls: "cumulative-layout-shift",
} as const;

/**
 * One fixed browser for every host. CI runners have no GPU, so nothing uses
 * one. WebGL is off: the background terminal animates without end, and under
 * software GL it keeps the page from ever going idle. The page then shows its
 * own no-WebGL art. `renderer` measures the live terminal on its own.
 */
const CHROME_FLAGS =
  "--headless=new --no-sandbox --disable-gpu --disable-3d-apis";

/**
 * chrome-launcher starts Chrome in its own process group, so a timed-out
 * Lighthouse run can leave Chrome behind. Each Chrome gets this switch, which
 * it ignores, so only this bench's Chrome is ever killed.
 */
const MARKER = `--performance-bench=${process.pid}`;

/** Longer than any healthy run takes, so a hang fails instead of stalling CI. */
const LIGHTHOUSE_TIMEOUT_MS = 120_000;
const SAMPLE_TIMEOUT_MS = 60_000;

const fail = (message: string): never => {
  console.error(message);
  process.exit(2);
};

const write = (result: object) => {
  if (!values.out) return;
  mkdirSync(path.dirname(path.resolve(values.out)), { recursive: true });
  writeFileSync(values.out, `${JSON.stringify(result, null, 2)}\n`);
};

// A broken run exits 2, never 1, so it cannot pass for a regression. What it
// measured before breaking is kept, marked incomplete.
let partial: object = {};
process.on("uncaughtException", (error) => {
  console.error(error);
  write({ ...partial, incomplete: true, error: String(error) });
  process.exit(2);
});

/** Every metric a complete run of `kind` measures, by name. */
const expected = (kind: "workloads" | "lighthouse") =>
  kind === "workloads"
    ? { samples: ["infra-layout ms"], bytes: [] }
    : {
        samples: PROFILES.flatMap((p) =>
          Object.keys(AUDITS).map((metric) => `${p.name} ${metric}`),
        ),
        bytes: PROFILES.flatMap((p) =>
          ["script bytes", "total bytes", "requests"].map(
            (m) => `${p.name} ${m}`,
          ),
        ),
      };

/** The pinned Playwright Chromium, unless CHROME_PATH names another (NixOS). */
const chromePath = async () =>
  process.env.CHROME_PATH ||
  (await import("@playwright/test")).chromium.executablePath();

// One fresh process per sample, so no sample warms the JIT for the next. The
// page's prerender runs the layout exactly once, cold, like this.
if (kind === "sample") {
  const root = path.resolve(roots[0]);
  const { OVERVIEW, OVERVIEW_SIZES } = await import(
    path.join(root, "src/lib/content/infra/topology.ts")
  );
  const { wideAndTall } = await import(
    path.join(root, "src/lib/data/graph-layout.ts")
  );
  const start = performance.now();
  wideAndTall(OVERVIEW, OVERVIEW_SIZES);
  console.log(performance.now() - start);
  process.exit(0);
}

type Samples = Record<string, { base: number[]; head: number[] }>;
interface Result {
  kind: "workloads" | "lighthouse";
  runs: number;
  base: { commit: string; dirty: boolean };
  head: { commit: string; dirty: boolean };
  environment: {
    cpu: string;
    os: string;
    node: string;
    lighthouse?: { version: string; userAgent: string };
  };
  samples: Samples;
  bytes: Samples;
}

if (kind === "record") {
  if (roots.length !== 2)
    fail("usage: record <workloads.json> <lighthouse.json>");
  const results: Result[] = roots.map((file) =>
    JSON.parse(readFileSync(file, "utf8")),
  );
  // A baseline comes only from a complete, clean A/A run of each kind.
  if (results[0].kind !== "workloads" || results[1].kind !== "lighthouse")
    fail("record takes a workloads result, then a lighthouse result");
  for (const r of results) {
    if (r.base.dirty || r.head.dirty) fail(`${r.kind}: a checkout was dirty`);
    if (r.kind === "lighthouse" && !r.environment.lighthouse?.userAgent)
      fail("lighthouse: no browser recorded");
    const want = expected(r.kind);
    if (!Number.isInteger(r.runs) || r.runs < 2 || r.runs > MAX_RUNS)
      fail(`${r.kind}: invalid run count ${r.runs}`);
    assertPower(r.runs, want.samples.length);
    for (const [into, names] of [
      [r.samples, want.samples],
      [r.bytes, want.bytes],
    ] as const) {
      if (Object.keys(into).toSorted().join() !== names.toSorted().join())
        fail(`${r.kind}: metrics differ from a complete run`);
      for (const [name, s] of Object.entries(into)) {
        if (s.base.length !== r.runs || s.head.length !== r.runs)
          fail(`${r.kind}: ${name} does not have ${r.runs} runs per side`);
        if (
          [...s.base, ...s.head].some(
            (value) => !Number.isFinite(value) || value < 0,
          )
        )
          fail(`${r.kind}: ${name} contains an invalid measurement`);
      }
    }
  }
  const machine = (r: Result) =>
    JSON.stringify([r.environment.cpu, r.environment.os, r.environment.node]);
  if (machine(results[0]) !== machine(results[1]))
    fail("the two A/A results come from different machines");
  const commits = new Set(
    results.flatMap((r) => [r.base.commit, r.head.commit]),
  );
  if (commits.size !== 1)
    fail(
      `A/A results must measure one commit on both sides: ${[...commits].join(", ")}`,
    );
  const floors: Record<string, number> = {};
  const budgets: Record<string, number> = {};
  for (const result of results) {
    for (const [name, s] of Object.entries(result.samples)) {
      const value = floor(s.base, s.head);
      if (!Number.isFinite(value))
        fail(`${result.kind}: ${name} gave floor ${value}`);
      floors[name] = value;
    }
    // Two builds of one commit differ by their content hashes. The largest
    // difference seen between them is the allowance: one for byte counts,
    // and its own for request counts, which hashes should never change.
    const entries = Object.entries(result.bytes);
    const allowance = (requests: boolean) =>
      Math.max(
        0,
        ...entries
          .filter(([name]) => name.endsWith(" requests") === requests)
          .map(([, s]) => Math.abs(Math.max(...s.base) - Math.max(...s.head))),
      );
    for (const [name, s] of entries)
      budgets[name] =
        Math.max(...s.base, ...s.head) + allowance(name.endsWith(" requests"));
  }
  const baseline = {
    commit: [...commits][0],
    alpha: ALPHA,
    runs: Object.fromEntries(results.map((r) => [r.kind, r.runs])),
    floors,
    budgets,
    evidence: roots.map((file) =>
      path.relative(path.dirname(BASELINE), path.resolve(file)),
    ),
  };
  writeFileSync(BASELINE, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`wrote ${BASELINE}`);
  process.exit(0);
}

const usage =
  "usage: performance-bench.ts workloads|lighthouse <base> <head> [--runs N] [--out FILE], or lighthouse-smoke|renderer <root> [--out FILE]";
if (!["workloads", "lighthouse", "lighthouse-smoke", "renderer"].includes(kind))
  fail(usage);
if (roots.length !== (kind === "renderer" || smoke ? 1 : 2)) fail(usage);
if (smoke && values.runs !== undefined)
  fail("lighthouse-smoke always runs once per profile; omit --runs");
const [base, head = base] = roots.map((root) => path.resolve(root));

const git = (root: string, ...args: string[]) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
const describe = (root: string) => ({
  root,
  commit: git(root, "rev-parse", "HEAD"),
  dirty:
    git(root, "status", "--porcelain", "--untracked-files=no") !== "" ||
    git(
      root,
      "ls-files",
      "--others",
      "--exclude-standard",
      "--",
      ".",
      ":(exclude)performance/results/**",
    ) !== "",
});
const cpus = os.cpus();
const environment: Record<string, unknown> = {
  date: new Date().toISOString(),
  os: `${os.type()} ${os.release()} ${os.arch()}`,
  cpu: cpus[0]?.model.trim(),
  cores: cpus.length,
  memoryGiB: +(os.totalmem() / 2 ** 30).toFixed(1),
  node: process.version,
  ci: process.env.GITHUB_ACTIONS === "true",
  runner: process.env.RUNNER_NAME ?? null,
  image: process.env.ImageOS
    ? `${process.env.ImageOS} ${process.env.ImageVersion}`
    : null,
  run: process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_RUN_ID}/${process.env.GITHUB_RUN_ATTEMPT} at ${process.env.GITHUB_SHA}`
    : null,
  loadBefore: os.loadavg(),
};

// Each checkout gets its own production server, up for the whole run.
const servers: ChildProcess[] = [];
let stopped = false;
const stopServers = () => {
  if (stopped) return;
  stopped = true;
  for (const server of servers) {
    try {
      process.kill(-server.pid!, "SIGTERM");
    } catch {}
  }
};
process.on("exit", stopServers);
process.on("exit", () => killMarked(MARKER));
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => process.exit(130));
const serve = async (root: string, port: number) => {
  const url = `http://127.0.0.1:${port}`;
  const expectedHtml = readFileSync(
    path.join(root, "build/index.html"),
    "utf8",
  );
  // An old server on the port would answer for the wrong build.
  if (
    await fetch(url, {
      signal: AbortSignal.timeout(1000),
    }).then(
      () => true,
      () => false,
    )
  )
    throw new Error(`port ${port} is already in use`);
  const server = spawn(
    "pnpm",
    [
      "exec",
      "vp",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    { cwd: root, stdio: "ignore", detached: true },
  );
  servers.push(server);
  for (let i = 0; i < 150; i++) {
    if (server.exitCode !== null)
      throw new Error(`the server for ${root} exited ${server.exitCode}`);
    const response = await fetch(url, {
      signal: AbortSignal.timeout(1000),
    }).catch(() => undefined);
    if (response?.ok) {
      if ((await response.text()) !== expectedHtml)
        throw new Error(`${url} does not serve the build in ${root}`);
      return url;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`no server on port ${port} for ${root}`);
};

const build = (root: string) =>
  run("pnpm", ["run", "build"], { cwd: root, timeout: 120_000 });

if (kind === "renderer") {
  // Report only: software WebGL timings say little about a phone's GPU, and
  // hosted runners have none. Fixed SwiftShader, so every host renders alike.
  const { chromium } = await import("@playwright/test");
  await build(base);
  // Covers startup, every CDP/evaluate call, sampling, and browser shutdown.
  const watchdog = setTimeout(() => {
    const error = "renderer: no completion in 60 s";
    write({ ...partial, kind, environment, incomplete: true, error });
    for (const server of servers) {
      try {
        process.kill(-server.pid!, "SIGKILL");
      } catch {}
    }
    killMarked(MARKER);
    console.error(error);
    process.exit(2);
  }, 60_000);
  const url = await serve(base, 4183);
  const args = [
    MARKER,
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ];
  const browser = await chromium.launch({
    executablePath: await chromePath(),
    args,
    timeout: 30_000,
  });
  const viewports = {
    mobile: { width: 412, height: 823, deviceScaleFactor: 1.75 },
    desktop: { width: 1350, height: 940, deviceScaleFactor: 1 },
  };
  const report: Record<string, unknown> = {};
  partial = { kind, environment, root: describe(base), report };
  for (const [name, { deviceScaleFactor, ...viewport }] of Object.entries(
    viewports,
  )) {
    const page = await browser.newPage({ viewport, deviceScaleFactor });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Performance.enable");
    page.setDefaultTimeout(30_000);
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(1000);
    const webgl = await page.evaluate(() =>
      document.documentElement.classList.contains("webgl"),
    );
    if (!webgl) throw new Error(`${name}: WebGL unavailable`);
    const busy = async () =>
      (await cdp.send("Performance.getMetrics")).metrics.find(
        (m) => m.name === "TaskDuration",
      )!.value;
    const before = await busy();
    // Five seconds of frames; the watchdog also covers an unresponsive page.
    const frames = await page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const times: number[] = [];
          const done = () =>
            resolve(times.slice(1).map((x, i) => x - times[i]));
          setTimeout(done, 5000);
          const tick = (t: number) => {
            times.push(t);
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
    if (frames.length < 2)
      throw new Error(`${name}: ${frames.length} frames in 5 s`);
    const mainThread = (await busy()) - before;
    const sorted = frames.toSorted((a, b) => a - b);
    report[name] = {
      viewport: { ...viewport, deviceScaleFactor },
      webgl,
      frames: frames.length,
      fps: +(frames.length / 5).toFixed(1),
      frameMedianMs: +sorted[sorted.length >> 1].toFixed(2),
      frameP95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
      mainThreadBusyShare: +(mainThread / 5).toFixed(3),
    };
    await page.close();
  }
  environment.browser = browser.version();
  environment.browserArgs = args;
  await browser.close();
  clearTimeout(watchdog);
  stopServers();
  console.log(JSON.stringify(report, null, 2));
  write({ kind, environment, root: describe(base), report });
  process.exit(0);
}

// Gates: everything below compares base with head.
// With no baseline yet, a run still writes its samples for `record`, then fails.
const baseline = existsSync(BASELINE)
  ? JSON.parse(readFileSync(BASELINE, "utf8"))
  : { runs: {}, floors: {}, budgets: {} };
const recorded = existsSync(BASELINE);
if (recorded) {
  for (const [name, value] of Object.entries({
    ...baseline.floors,
    ...baseline.budgets,
  })) {
    if (!Number.isFinite(value) || (value as number) < 0)
      fail(`baseline.json: ${name} is not a finite nonnegative threshold`);
  }
}
if (recorded && baseline.alpha !== ALPHA)
  fail(`baseline.json was recorded at alpha ${baseline.alpha}, not ${ALPHA}`);
const runs = smoke ? 1 : Number(values.runs ?? baseline.runs[kind]);
if (!smoke && (!Number.isInteger(runs) || runs < 2 || runs > MAX_RUNS))
  fail(`--runs must be a whole number from 2 to ${MAX_RUNS}`);
// The floors hold only for the run count they were recorded with.
if (!smoke && recorded && runs !== baseline.runs[kind])
  fail(
    `${runs} runs per side; baseline.json was recorded with ${baseline.runs[kind]}`,
  );

const samples: Samples = {};
const bytes: Samples = {};
partial = { kind, environment, runs, samples, bytes };
const add = (
  into: Samples,
  name: string,
  side: "base" | "head",
  value: number,
) => {
  if (!Number.isFinite(value))
    throw new Error(`${name}: ${side} measured ${value}`);
  (into[name] ??= { base: [], head: [] })[side].push(value);
};
// A single PR sample is a report, never a statistical timing verdict.
const order: ("base" | "head")[] = smoke ? ["head"] : abba(runs);

if (kind === "workloads") {
  assertPower(runs, 1);
  const script = fileURLToPath(import.meta.url);
  for (const side of order) {
    const root = side === "base" ? base : head;
    const ms = Number(
      await run(process.execPath, [script, "sample", root], {
        cwd: root,
        timeout: SAMPLE_TIMEOUT_MS,
      }),
    );
    add(samples, "infra-layout ms", side, ms);
    process.stderr.write(`${side} ${ms.toFixed(1)} ms\n`);
  }
} else {
  if (!smoke) assertPower(runs, PROFILES.length * Object.keys(AUDITS).length);
  await build(head);
  const urls = {
    ...(smoke ? {} : { base: await serve(base, 4181) }),
    head: await serve(head, 4182),
  };
  // A missing route would still give Lighthouse a 404 page to measure.
  for (const url of Object.values(urls))
    for (const { route } of PROFILES) {
      const response = await fetch(`${url}${route}`, {
        redirect: "manual",
        signal: AbortSignal.timeout(10000),
      });
      if (response.status !== 200)
        throw new Error(`${url}${route} answered ${response.status}`);
    }
  const chrome = await chromePath();
  environment.chrome = {
    path: chrome,
    version: execFileSync(chrome, ["--version"], { encoding: "utf8" }).trim(),
  };
  const lighthouse = path.join(
    import.meta.dirname,
    "../../node_modules/.bin/lighthouse",
  );
  const reports = values.out ? `${values.out}.reports` : null;
  if (reports) mkdirSync(reports, { recursive: true });
  const meta = {
    version: "",
    userAgent: "",
    chromeFlags: CHROME_FLAGS,
    benchmarkIndex: [] as number[],
    settings: {} as Record<string, unknown>,
  };
  // ponytail: one Chrome per run, as Lighthouse recommends; a shared browser would be faster and leak state between runs.
  for (const profile of PROFILES) {
    for (const [i, side] of order.entries()) {
      const json = await run(
        lighthouse,
        [
          `${urls[side]}${profile.route}`,
          ...profile.flags,
          `--only-audits=${Object.values(AUDITS).join(",")},resource-summary`,
          "--max-wait-for-load=30000",
          "--output=json",
          "--output-path=stdout",
          "--quiet",
          `--chrome-flags=${CHROME_FLAGS} ${MARKER}`,
        ],
        {
          cwd: head,
          timeout: LIGHTHOUSE_TIMEOUT_MS,
          env: { ...process.env, CHROME_PATH: chrome },
          marker: MARKER,
        },
      );
      const lhr = JSON.parse(json);
      if (lhr.runtimeError)
        throw new Error(`${profile.name}: ${lhr.runtimeError.message}`);
      // Same page, not a redirect; /blogs adds its own ?page=1.
      if (new URL(lhr.finalDisplayedUrl).pathname !== profile.route)
        throw new Error(`${profile.name}: ended at ${lhr.finalDisplayedUrl}`);
      for (const [metric, id] of Object.entries(AUDITS))
        add(
          samples,
          `${profile.name} ${metric}`,
          side,
          lhr.audits[id]?.numericValue,
        );
      const items: {
        resourceType: string;
        transferSize: number;
        requestCount: number;
      }[] = lhr.audits["resource-summary"]?.details?.items ?? [];
      const of = (type: string) =>
        items.find((item) => item.resourceType === type);
      add(
        bytes,
        `${profile.name} script bytes`,
        side,
        of("script")?.transferSize ?? NaN,
      );
      add(
        bytes,
        `${profile.name} total bytes`,
        side,
        of("total")?.transferSize ?? NaN,
      );
      add(
        bytes,
        `${profile.name} requests`,
        side,
        of("total")?.requestCount ?? NaN,
      );
      meta.version = lhr.lighthouseVersion;
      meta.userAgent = lhr.environment.hostUserAgent;
      meta.benchmarkIndex.push(lhr.environment.benchmarkIndex);
      meta.settings[profile.name] = {
        formFactor: lhr.configSettings.formFactor,
        throttlingMethod: lhr.configSettings.throttlingMethod,
        throttling: lhr.configSettings.throttling,
        screenEmulation: lhr.configSettings.screenEmulation,
      };
      if (reports)
        writeFileSync(
          path.join(
            reports,
            `${profile.name.replaceAll(/\W+/g, "_")}-${i}-${side}.json`,
          ),
          json,
        );
      process.stderr.write(
        `${side} ${profile.name} lcp ${lhr.audits[AUDITS.lcp].numericValue.toFixed(0)} ms\n`,
      );
    }
  }
  stopServers();
  environment.lighthouse = meta;
}

const result = {
  kind,
  environment: { ...environment, loadAfter: os.loadavg() },
  baselineCommit: baseline.commit,
  base: smoke ? undefined : describe(base),
  head: describe(head),
  timingReportOnly: smoke,
  runs,
  order,
  samples,
  bytes,
};
write(result);

// A metric with no recorded floor or budget fails: a new metric needs a
// reviewed baseline before it can pass.
const want = expected(kind === "workloads" ? "workloads" : "lighthouse");
const missing = [
  ...want.samples.filter(
    (name) => !(name in samples && (smoke || name in baseline.floors)),
  ),
  ...want.bytes.filter((name) => !(name in bytes && name in baseline.budgets)),
];
if (missing.length)
  fail(`no recorded floor or budget for: ${missing.join(", ")}`);

const cells: Cell[] = Object.entries(samples).map(([name, s]) => ({
  name,
  ...s,
  floor: baseline.floors[name],
}));
const verdicts = smoke ? [] : judge(cells);
if (smoke) {
  for (const [name, s] of Object.entries(samples))
    console.log(`report-only ${name}: ${s.head[0]}`);
} else console.log(table(verdicts));
const over = Object.entries(bytes).map(([name, s]) => ({
  name,
  value: Math.max(...s.head),
  budget: baseline.budgets[name] as number,
}));
for (const { name, value, budget } of over)
  console.log(
    `${value > budget ? "FAIL" : "ok  "} ${name.padEnd(30)} ${value} of ${budget}`,
  );
write({ ...result, verdicts, budgets: over });

const failed = [
  ...verdicts.filter((v) => v.regressed).map((v) => v.name),
  ...over.filter((o) => o.value > o.budget).map((o) => o.name),
];
if (failed.length) {
  console.error(`${failed.length} regression(s): ${failed.join(", ")}`);
  process.exit(1);
}
