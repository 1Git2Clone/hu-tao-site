# Performance gates

Two CI jobs compare the pushed code with one baseline commit, on the same
runner, taking turns:

| Job          | Measures                                                        | Script                            |
| ------------ | --------------------------------------------------------------- | --------------------------------- |
| `benchmarks` | The `/infra` layout (`wideAndTall`), cold, one process per run  | `performance-bench.ts workloads`  |
| `lighthouse` | FCP, LCP, TBT and CLS; script bytes, total bytes, request count | `performance-bench.ts lighthouse` |
| `lighthouse` | The live WebGL background, report only                          | `performance-bench.ts renderer`   |

`scripts/ci/performance-baseline.sh` checks out the commit in `baseline.json`
next to the pushed code, with its own install and build. The base and head runs
alternate B H H B, so a runner that slows down slows both sides alike. Hosted
runners change CPU from run to run; comparing on one runner removes that.

## When a timing fails

Both must hold:

1. **It is consistent.** An exact one-sided permutation test (Mann–Whitney)
   compares the base and head runs. All timings in one job share a 1 %
   chance of a false failure (`ALPHA`, Holm's method). The run count is
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
servers that exit during startup. Before measuring, it compares the served
homepage HTML with that checkout's `build/index.html`. A stale server cannot
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

Byte and request counts do not vary between runs, so they are not timings.
`budgets` in `baseline.json` hold the baseline's value plus the largest
difference seen between two clean builds of the same commit: SvelteKit's
content hashes and its `__sveltekit_<id>` name change from build to build.
Requests get their own allowance, from request counts only. Head fails when
it goes over. `record` accepts only complete, clean A/A runs of one commit,
from one machine.

A real byte increase, such as a new post on `/blogs`, can raise only the
affected `budgets` entry by hand in a reviewed commit that says why. The
timings and floors stay as recorded. Byte counts do not depend on the
machine, so this needs no new A/A run.

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

## Initial evidence

The baseline commit is `a85553847adf1252966c97031e94ac24c5e6523e`.
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
