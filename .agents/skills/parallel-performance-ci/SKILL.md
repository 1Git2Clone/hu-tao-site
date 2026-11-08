---
name: parallel-performance-ci
description: Use when changing performance CI, Lighthouse jobs, or investigating a performance gate failure on a small content or metadata update.
---

# Parallel Performance CI

- Keep independent Lighthouse page profiles in separate parallel jobs. Do not
  put every profile and renderer sampling in one long sequential job.
- Keep baseline and head samples for a profile on the same runner. Preserve
  paired ordering, sample counts, measured floors and the suite's combined
  false-failure bound when splitting statistical checks.
- Run report-only renderer sampling separately. It must not delay deployment.
- Give each profile a unique artifact. Preserve other profiles' results after
  one fails, and collect all page artifacts for the deployed report.
- Read failed CI measurements before assigning a cause. Separate timing
  failures, transfer growth, build variance and broken measurements.
- Metadata changes affect HTML and compression. Check transfer budgets as
  well as type checks before reporting completion. Preserve the failed run
  and explain any reviewed budget correction with measured evidence.
- Distinguish measured noise from an explicit materiality policy. The transfer
  gate has a reviewed 1 KiB allowance for small metadata/compression changes;
  request budgets remain exact. Preserve this policy when recording baselines.
- Do not hide failures with retries, automatic baseline updates, removed
  gates, or unexplained threshold increases. Prove real regressions still fail.
