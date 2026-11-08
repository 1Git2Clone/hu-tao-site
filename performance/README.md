# Performance gates

## Visual reports

Open `/benchmarks/` on a PR preview or the production site. Each deployment
publishes its own CI measurements: timing cards, all-sample charts, median
changes, gate details and byte/request budget bars. The preview comment links
directly to the report. PR timing cards say **Report only**; main uses the full
statistical verdicts. An incomplete run never appears as a successful timing.

Each page profile links to Lighthouse's native HTML report. For full runs,
this is the actual head sample nearest median LCP, not an averaged audit.
Only the selected audits run, so the dashboard does not invent an overall
PageSpeed score. The renderer measurement remains in the raw artifact.

The `benchmarks` and `lighthouse-*` workflow artifacts also contain a standalone
`report/index.html` and native Lighthouse HTML reports. They remain available
for 14 days, including when a gate fails. Open the HTML after extracting the
artifact. The published site updates only after every gate passes.

`scripts/ci/performance-report.ts <artifact-directory> <output-directory>`
renders the existing JSON files without collecting new samples. Deployment
downloads the benchmark and all four Lighthouse artifacts from the current workflow and generates the combined
report in `build/benchmarks` after the Netlify build. Report assets therefore
do not change the measured application bundles or transfer budgets.

## Checks

PRs use a fast Lighthouse check; pushes to `main` use the full comparison.
The PR Lighthouse job targets under two minutes, including setup and build.

| Job                 | When        | Behaviour                                                                                                                   |
| ------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `benchmarks`        | PR and main | Compare the cold `/infra` layout against the baseline.                                                                      |
| `lighthouse` matrix | PR          | Four parallel jobs, one head-only audit each. Report timings; gate bytes, requests and broken measurements.                 |
| `lighthouse` matrix | Main        | Four parallel jobs, 14 paired audits each. Every profile compares base and head on the same runner. Gate timings and bytes. |
| `renderer`          | Main        | Independent report-only software WebGL job. It does not block deployment.                                                   |

The four profile jobs run independently, with `fail-fast: false`. One failure
does not cancel the other reports. Each has a distinct artifact, retained even
when its gate fails. Deployment waits for all four page gates.

The fast path skips the baseline checkout, install and build, and the separate
renderer report. It still checks all four profiles. A single timing sample
cannot establish a consistent regression, so it never produces a statistical
timing verdict. Main retains the measured noise floors and full statistical
test before production deployment. The browser suite checks WebGL health on
both PRs and main.

For comparisons, `scripts/ci/performance-baseline.sh` checks out the commit in `baseline.json`
next to the pushed code, with its own install and build. The base and head runs
alternate B H H B, so a runner that slows down slows both sides alike. Hosted
runners change CPU from run to run; comparing on one runner removes that.

## When a timing fails

In full Lighthouse comparisons and the graph benchmark, both must hold:

1. **It is consistent.** An exact one-sided permutation test (Mann–Whitney)
   compares the base and head runs. The complete Lighthouse suite shares a
   1 % false-failure bound (`ALPHA`). Each parallel profile gets `ALPHA / 4`,
   with Holm's method across its four timings. The union bound keeps the
   complete suite at or below 1 %. The unsplit local command keeps global Holm.
   The run count is
   chosen so this can fail at all: the smallest p-value of _n_ runs per side
   is 1 / C(2n, n). Lighthouse gates 16 timings, so it needs 7 runs per side;
   the script refuses fewer.
2. **It is bigger than ordinary noise.** `floors` in `baseline.json` hold, for
   each timing, how far two medians of the _same_ code move apart, in the
   metric's own unit (ms, or CLS units): of every way to split one A/A run's
   samples into two sides, 99 % move less. A consistent rise under that floor
   passes. A unit, not a share, because a TBT or CLS of 0 has no relative
   change; samples that never vary give a floor of 0.

No retry runs. A run that hangs is killed (120 s for Lighthouse, 60 s for a
workload sample) and fails the job. So do: a route that does not answer 200,
a report that ends at another URL, a missing or non-finite metric, a metric
with no floor or budget, a run count other than the recorded one, and a
`baseline.json` recorded at another `ALPHA`.

Each preview uses a separate port. The harness rejects occupied ports and
servers that exit during startup. The harness rebuilds the head from its current
checkout before Lighthouse measurement. It then compares the served homepage
HTML with that checkout's `build/index.html`. A stale server cannot
supply samples for a different build. Timed-out Chrome processes are removed
with an exact, per-run command-line marker, including detached children.

### What this cannot see

- Power. With 7 Lighthouse runs per side and 16 timings, Holm's first level
  is 0.01 / 16. Only 2 of the 3432 ways to split the runs reach it, so a
  timing fails only when nearly every head run is slower than every base
  run, by more than its floor. A regression that is real but smaller than the
  runner's noise passes. The workload has 1 timing and 10 runs per side
  (1 / 184 756), so it can see smaller shifts.
- Drift. The base is the recorded commit, not the PR's merge base. Small
  slowdowns that each pass add up against it. A later PR can then fail for
  them; read the table, and re-record when the accumulated change is
  accepted.
- Hosts. Floors are in milliseconds, measured on the recording machine. A
  slower runner has larger absolute noise. The paired permutation test still
  rejects noise, but the floor is then smaller than that runner's own spread.
- Names. The workload imports `OVERVIEW`, `OVERVIEW_SIZES` and
  `wideAndTall` from the base checkout. Renaming them breaks the gate until
  the baseline is re-recorded.

## When bytes fail

Byte and request counts use explicit budgets, not timing significance tests.
`budgets` in `baseline.json` hold the baseline's value plus the largest
difference seen between two clean builds of the same commit: SvelteKit's
content hashes and its `__sveltekit_<id>` name change from build to build.
`transferAllowanceBytes` adds an explicit 1 KiB materiality allowance to script
and total transfer budgets. Small metadata edits and compression differences
can change a few bytes without a meaningful performance change. This is a
policy choice, not an empirically measured noise floor. It applies once per
transfer metric, never to requests or timings. Request budgets remain exact.
Head fails above the resulting limit. Reports show that effective limit.
Older baselines without the field retain exact byte limits. `record` preserves
the reviewed allowance and accepts only complete, clean A/A runs of one commit,
from one machine.

A real byte increase above the allowance, such as a new post on `/blogs`, can raise only the
affected `budgets` entry by hand in a reviewed commit that says why. The
timings and floors stay as recorded. Browser versions and build environments
can also change transfer counts. Such an update needs evidence from both
builds, a production-source comparison, and an explicit allowance derived
from measured build differences. It does not require new timing floors.

## Fixed conditions

- Lighthouse: its default mobile settings (simulated throttling), plus one
  `--preset=desktop` run of `/`. Routes: `/`, `/blogs`, and one post. Only
  the gated audits and `resource-summary` run; there is no Speed Index.
- Browser: the Chromium that the locked `@playwright/test` installs, so it
  changes only with the lockfile. `CHROME_PATH` overrides it (NixOS cannot
  run the downloaded build). Flags: `--headless=new --no-sandbox
  --disable-gpu --disable-3d-apis`.
  Runners have no GPU. With WebGL the background animates without end, and
  under software GL the page never goes idle (an unbounded run hung for over
  10 minutes). The page then shows its own no-WebGL art.
- The renderer report uses SwiftShader at 412×823 (×1.75) and 1350×940, and
  records five seconds of frames and main-thread time. Software GL says
  little about a phone's GPU, so it has no threshold, and its step is
  `continue-on-error`: a failure to collect it shows in the log and the
  artifact, but does not fail the job.
- Renderer collection has a 60-second watchdog across startup, CDP requests,
  page evaluation, sampling and browser shutdown. A timeout kills its browser
  and preview server. Missing WebGL marks the report incomplete.
- Every result records the commits, dirty state, CPU, cores, memory, OS,
  Node, load averages, Lighthouse and Chrome versions, Lighthouse's
  `benchmarkIndex` for each run, and the raw samples.

## Updating the baseline

Never automatically, and never to make a regression pass unread.

1. Check out the new baseline commit in two worktrees, each installed and
   built (`scripts/ci/performance-baseline.sh <dir> build` makes one).
2. Run an A/A comparison of the two, with the run counts the gate uses:

   ```sh
   node scripts/checks/performance-bench.ts workloads <a> <b> --runs 10 --out performance/results/<date>-aa-workloads.json
   node scripts/checks/performance-bench.ts lighthouse <a> <b> --runs 7 --out performance/results/<date>-aa-lighthouse.json
   ```

   With no `baseline.json` entry yet, these exit 2 after writing the samples.

3. `node scripts/checks/performance-bench.ts record <workloads.json> <lighthouse.json>`
   writes `baseline.json`. Commit it with both result files, and say why in
   the commit.

A/A floors come from the machine that recorded them. If CI's own noise is
larger, the permutation test, not the floor, keeps CI from failing on it.

## Local runs

Run inside `nix develop`. On NixOS, set `CHROME_PATH` to a system Chrome.
Each Lighthouse run takes one Chrome; keep other heavy work off the machine.

To reproduce the fast PR path against one production build:

```sh
node scripts/checks/performance-bench.ts lighthouse-smoke <head> --out /tmp/lighthouse-smoke.json
```

The existing `lighthouse <base> <head>` command retains the full comparison.
Pass `--profile 'mobile /'` (or another exact profile name) to either Lighthouse
command to run one shard. Unknown profiles and profiles on other commands fail.

## Initial evidence

The initial baseline commit was `a85553847adf1252966c97031e94ac24c5e6523e`.
The committed result files identify the browser, machine and run conditions.
Other desktop applications were running on the recording host. These are
paired local measurements, not measurements of a physical phone's GPU.

Script transfer sizes before and after the behaviour fixes:

| Mobile route                     | Before (bytes) | Final clean builds (bytes) |
| -------------------------------- | -------------: | -------------------------: |
| `/`                              |         96,587 |              96,361–96,364 |
| `/blogs`                         |         98,860 |              99,029–99,031 |
| `/blogs/intro-to-big-o-notation` |         98,343 |              98,372–98,373 |

The font requests load the optimized Regular subset, plus KaTeX on the post.
The full Bold, Italic and Light fonts are not requested. The shared icon table
is about 36 KB of source, but that alone does not establish a bottleneck.
No speculative renderer, font or graph-algorithm optimization ships here.

The deliberately slower workload changes graph-layout tries from 200 to 300
in a temporary checkout. The real gate exits 1: its median rises from
2193.4 ms to 3235.1 ms, above the recorded 104.6 ms noise floor, with
p = 0.00000541. The production source keeps 200 tries.

The Lighthouse proof adds a 300 ms client busy loop and a 20,000-character
literal script payload in that temporary checkout. With seven runs per side,
the real gate exits 1 with six timing failures and eight byte-budget failures.
Homepage mobile TBT rises from a median 45 ms to 648 ms, above its 25 ms
noise floor (p = 1 / 3432). Script transfer grows by about 16 KB per page.
Request counts stay within budget. None of those injected changes ship.

The A/A samples calibrate the limits. A second independent local Lighthouse
A/A gate run was not collected; the PR's CI run supplies a separate comparison.

The first complete hosted comparison passes all 16 timings. Three local byte
budgets were too small even for the baseline build under CI's locked Chrome
158 (the local NixOS override was Chrome 156). The two CI builds differ by at
most 10 bytes per metric. The reviewed byte-only update uses the larger
observed transfer count plus those 10 bytes, and changes only three budgets.
`byte-budget-review.json` records the exact limits, browser versions and the
unchanged production-source/dependency comparison. Timing floors, sample
counts and request budgets remain unchanged. The original CI failure is
preserved in `ci-lighthouse.json`.

The statistics tests were also run against five deliberately broken versions:
no effect floor, no Holm correction, no finite-value check, no power check,
and an incorrect tie comparison. Every version failed its tests. The timeout
test confirms that a detached marked process is removed while a process with
a longer, different marker stays alive.

`before-smoke.json` contains one pre-change Lighthouse run per profile. It
supports byte comparisons, not a claim of a timing improvement. The renderer
report uses software WebGL and was collected while a production build and
other desktop applications were running; it is not a GPU performance budget.

An earlier Lighthouse calibration was withdrawn after the occupied-port
guard found a stale preview serving the previous commit. Its samples are not
used for the baseline. The replacement verifies build HTML on both ports.

The article mobile FCP floor uses the hosted samples in
`2026-11-07-ci-lighthouse.json`. Those two commits have identical production
source and dependencies. Pooling their seven samples per side gives an
8.5594 ms floor, replacing the local 168.25145 ms floor for this metric only.
`2026-11-08-ci-fcp-floor-review.json` records the calculation and a consistent
100 ms injection that fails the 16-metric Holm gate. Other floors stay unchanged.

Local commands use `procps` from the Nix shell for exact marker matching.
The runner counts stdout and stderr against one limit and kills every active
sample group when interrupted. Dirty detection includes untracked inputs;
untracked files in `performance/results` remain measurement artifacts.

## Reference after the main rebase

The reference is now `c2a687677cd05c0e7e72426ddf53ecb9f6a9af06`, the
rebased equivalent of the behaviour fixes with the accepted main SEO and
public-image changes. The paired comparison passes all 16 Lighthouse timings
and the graph workload. Existing timing floors and sample counts remain.
The article now loads three images that the previous reference did not request.
Byte budgets use the larger measured reference/head transfer plus the existing
10-byte build allowance; request counts have no allowance.
`2026-11-08-new-base-review.json` records each changed limit and both full runs.

The hosted Chrome 158 smoke run of the same production source adds three
transfer-budget corrections over local Chrome 156. Each uses the observed
hosted value plus the existing 10-byte build allowance. Request counts and
timing limits stay unchanged. `2026-11-08-new-base-ci-budget-review.json` links
the workflow, preserved raw samples and exact budget changes.

The first full main comparison passes all timing checks but finds a 13-byte
transfer spread between source-equivalent hosted PR and main builds. The older
10-byte allowance was too narrow. The budgets now use the measured maximum
plus that 13-byte spread where existing headroom is smaller.
`2026-11-08-hosted-build-variance-review.json` records the three corrected
budgets, the source comparison and the full main results.

The `sameAs` metadata update passes all 16 timings. Its hosted run exceeds
the `/blogs` total budget by 6 bytes and the article budget by 3 bytes.
`2026-11-09-sameas-budget-review.json` records the explicit 1 KiB transfer
policy. The baseline budgets, timing floors, sample counts and request limits
stay unchanged. The raw failed run is preserved; tests replay its byte checks and confirm that
an injected 20 KB payload or one added request still exceeds the limits.
