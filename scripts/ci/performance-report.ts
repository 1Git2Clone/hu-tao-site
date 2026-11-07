// Render existing CI samples. No new measurements, scores or gate decisions.
// node scripts/ci/performance-report.ts <artifact-directory> <output-directory>
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ReportGenerator } from "lighthouse/report/generator/report-generator.js";
import { median, type Verdict } from "../checks/performance-stats.ts";

interface Result {
  kind: string;
  incomplete?: boolean;
  timingReportOnly?: boolean;
  error?: string;
  environment: { date?: string; cpu?: string; node?: string };
  head?: { commit: string; dirty: boolean };
  base?: { commit: string; dirty: boolean };
  samples: Record<string, { base: number[]; head: number[] }>;
  verdicts?: Verdict[];
  budgets?: { name: string; value: number; budget: number }[];
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error("usage: performance-report.ts <artifacts> <output>");
}
mkdirSync(output, { recursive: true });
const files = readdirSync(input, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => path.join(entry.parentPath, entry.name));
const results: Result[] = files
  .filter((file) => /(?:^|\/)(?:workloads|lighthouse)\.json$/.test(file))
  .map((file) => JSON.parse(readFileSync(file, "utf8")));
if (!results.length) throw new Error("no performance results found");

const escape = (value: string | number | undefined) =>
  String(value ?? "unavailable").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const number = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 3 });
const unit = (name: string) => (name.endsWith(" cls") ? "" : " ms");
const format = (name: string, value: number) => `${number(value)}${unit(name)}`;

// One native Lighthouse report per profile, chosen by the head run nearest
// median LCP. It is a real sample, not a synthetic report of averaged audits.
const native = new Map<string, string>();
const groups = new Map<string, { file: string; lcp: number }[]>();
for (const file of files.filter((file) => file.endsWith("-head.json"))) {
  const lhr = JSON.parse(readFileSync(file, "utf8"));
  if (!lhr.lighthouseVersion || lhr.runtimeError) continue;
  const name = `${lhr.configSettings.formFactor} ${new URL(lhr.finalDisplayedUrl).pathname}`;
  const lcp = lhr.audits["largest-contentful-paint"]?.numericValue;
  if (!Number.isFinite(lcp)) continue;
  groups.set(name, [...(groups.get(name) ?? []), { file, lcp }]);
}
for (const [name, runs] of groups) {
  const middle = median(runs.map((r) => r.lcp));
  const chosen = runs.toSorted(
    (a, b) => Math.abs(a.lcp - middle) - Math.abs(b.lcp - middle),
  )[0];
  const filename = `lighthouse-${native.size + 1}.html`;
  const lhr = JSON.parse(readFileSync(chosen.file, "utf8"));
  writeFileSync(
    path.join(output, filename),
    ReportGenerator.generateReportHtml(lhr),
  );
  native.set(name, filename);
}

const chart = (name: string, base: number[], head: number[]) => {
  const max = Math.max(1e-6, ...base, ...head);
  const x = (value: number) => 12 + (value / max) * 276;
  const row = (values: number[], y: number, side: string) =>
    values
      .map(
        (value) =>
          `<circle class="${side}" cx="${x(value)}" cy="${y}" r="4"><title>${side}: ${escape(format(name, value))}</title></circle>`,
      )
      .join("");
  return `<svg viewBox="0 0 300 72" role="img" aria-label="${escape(name)} samples; baseline above, current below; lower is better">
    <path d="M12 22H288M12 48H288" class="axis" />
    ${row(base, 22, "baseline")}${row(head, 48, "current")}
    <text x="12" y="70">0</text><text x="288" y="70" text-anchor="end">${escape(format(name, max))}</text>
  </svg>`;
};

const cards = (r: Result, names: string[]) =>
  names
    .map((name) => {
      const s = r.samples[name];
      const valid =
        [...s.base, ...s.head].every(Number.isFinite) && s.head.length > 0;
      if (!valid)
        return `<article><h3>${escape(name)}</h3><p>Measurement unavailable</p></article>`;
      const v = r.verdicts?.find((v) => v.name === name);
      const value = median(s.head);
      const delta = s.base.length ? value - median(s.base) : undefined;
      const status = r.incomplete
        ? "Incomplete run"
        : r.timingReportOnly
          ? "Report only"
          : v
            ? v.regressed
              ? "Regression"
              : "Within gate"
            : "Not judged";
      return `<article>
    <h3>${escape(name === "infra-layout ms" ? "Cold layout time" : name.split(" ").at(-1)?.toUpperCase())}</h3>
    <strong class="value">${escape(format(name, value))}</strong>
    <p class="status">${status}</p>
    ${delta === undefined ? "<p>One sample; no timing verdict.</p>" : `<p>Baseline ${escape(format(name, median(s.base)))}<br>Change ${delta >= 0 ? "+" : ""}${escape(format(name, delta))}</p>`}
    ${chart(name, s.base, s.head)}
    ${v ? `<details><summary>Gate details</summary><p>Noise floor: ${escape(format(name, v.floor))}<br>p = ${escape(v.p)}<br>Holm level = ${escape(v.level)}</p></details>` : ""}
  </article>`;
    })
    .join("");

const sections = results
  .map((r) => {
    const profiles = [
      ...new Set(
        Object.keys(r.samples ?? {}).map((name) =>
          name.slice(0, name.lastIndexOf(" ")),
        ),
      ),
    ];
    const timings = profiles
      .map(
        (profile) => `<section>
    <h2>${escape(profile === "infra-layout" ? "Infrastructure graph layout" : profile)}</h2>
    ${native.has(profile) ? `<a href="${native.get(profile)}">Open native Lighthouse report →</a>` : ""}
    <div class="cards">${cards(
      r,
      Object.keys(r.samples).filter(
        (name) => name.slice(0, name.lastIndexOf(" ")) === profile,
      ),
    )}</div>
  </section>`,
      )
      .join("");
    const budgets = (r.budgets ?? [])
      .map((b) => {
        const failed = b.value > b.budget;
        const percentage =
          b.budget === 0
            ? b.value > 0
              ? 100
              : 0
            : Math.min(100, (b.value / b.budget) * 100);
        return `<li><div><b>${escape(b.name)}</b><span>${failed ? "Over budget" : "Within budget"}</span></div><meter min="0" max="100" value="${percentage}" aria-label="${escape(b.name)} budget used">${number(percentage)}%</meter><small>${number(b.value)} / ${number(b.budget)} ${b.name.endsWith("requests") ? "requests" : "bytes"}</small></li>`;
      })
      .join("");
    return `<section class="run"><h2>${r.kind === "workloads" ? "CPU benchmark" : "Page loading"}</h2>
    <p>${escape(r.environment?.date)} · ${escape(r.environment?.cpu)} · ${escape(r.environment?.node)}</p>
    <p>Current: <code>${escape(r.head?.commit?.slice(0, 12))}</code>${r.head?.dirty ? " (modified)" : ""}${r.base ? ` · Baseline: <code>${escape(r.base.commit.slice(0, 12))}</code>${r.base.dirty ? " (modified)" : ""}` : ""}</p>
    ${r.incomplete ? `<p role="alert">Incomplete measurement. ${escape(r.error)}</p>` : ""}
    ${r.timingReportOnly ? "<p>PR check: one run per profile. Timings are observations. Only byte and request budgets are gated.</p>" : "<p>Charts show every sample. Values and changes use medians. Timing failures require statistical significance and a change above the measured noise floor.</p>"}
    ${timings}${budgets ? `<h2>Transfer budgets</h2><ul class="budgets">${budgets}</ul>` : ""}
  </section>`;
  })
  .join("");

// Reuse the site's palette and font; keep this standalone so a report can also
// be opened straight from an artifact without booting the Svelte application.
const root = new URL("../../", import.meta.url);
const palette = readFileSync(
  new URL("src/lib/styles/themes.css", root),
  "utf8",
).replace(/^@theme static\s*\{/m, ":root {");
const tailwindPalette = readFileSync(
  new URL("node_modules/tailwindcss/theme.css", root),
  "utf8",
).replace(/^@theme default\s*\{/m, ":root {");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Benchmarks · hu-tao.dev</title>
<style>
${tailwindPalette}
${palette}
@font-face{font-family:report-mono;src:url('/fonts/JetBrainsMonoNerdFont-Regular-Optimized.woff2') format('woff2');font-display:swap}
*{box-sizing:border-box}body{margin:0;background:var(--color-primary);color:var(--color-textcol);font:14px/1.65 report-mono,monospace}main{max-width:1120px;margin:auto;padding:32px 20px}h1{font-size:2rem}h2{font-size:1.2rem}h3{margin:0;font-size:1rem}a{color:var(--color-accent)}p{overflow-wrap:anywhere}section{margin:28px 0}.run{border-top:1px solid var(--color-tertiary);padding-top:20px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-top:16px}article{padding:20px;background:var(--color-muted);border:1px solid var(--color-tertiary);border-radius:8px}.value{font-size:1.8rem;display:block;color:var(--color-subtextcol)}.status{color:var(--color-accent)}svg{width:100%;height:auto}.axis{stroke:var(--color-tertiary);fill:none}.baseline{fill:var(--color-tertiary)}.current{fill:var(--color-accent)}text{font:10px monospace;fill:var(--color-textcol)}.legend{display:flex;gap:20px;flex-wrap:wrap}.legend span:before{content:'●';margin-right:8px}.legend .current,.legend .baseline{fill:none}.legend .current:before{color:var(--color-accent)}.legend .baseline:before{color:var(--color-tertiary)}.budgets{list-style:none;padding:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}.budgets li{padding:16px;border:1px solid var(--color-tertiary);border-radius:8px}.budgets div{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}meter{width:100%;height:20px;accent-color:var(--color-accent)}summary{cursor:pointer}code{overflow-wrap:anywhere}
</style><script>document.documentElement.classList.toggle('dark',matchMedia('(prefers-color-scheme: dark)').matches)</script></head>
<body><main><a href="/">← hu-tao.dev</a><h1>Benchmarks</h1>
<p>Measurements from the CI run that built this deployment.</p>
<p>FCP: first content paint. LCP: largest content paint. TBT: blocked main-thread time. CLS: layout movement. Lower is better.</p>
<p>Lighthouse uses simulated throttling and the no-WebGL background. These are lab measurements, not real-user Core Web Vitals. Only four timing audits run, so no overall PageSpeed score is shown.</p>
<div class="legend"><span class="baseline">Baseline samples (top)</span><span class="current">Current samples (bottom)</span></div>
${sections}
<footer><p>Native Lighthouse links show the actual head sample nearest median LCP. They contain the selected audits, not a full PageSpeed audit.</p><a href="https://github.com/1Git2Clone/hu-tao-site/blob/main/performance/README.md">Method and limits</a></footer>
</main></body></html>`;
writeFileSync(path.join(output, "index.html"), html);
console.log(`Visual report: ${path.join(output, "index.html")}`);
