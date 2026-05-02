---
name: one-off-main-commits
description: Use when the user requests a small one-off fix or copy correction while the repository is already on main.
---

# One-Off Main Commits

## Rule

Small one-off fixes may be committed directly to `main` when the user explicitly
allows it in the current turn or has corrected the workflow for that exact class
of task.

## Scope

This applies to narrow corrections such as:

- removing an inaccurate word or technology from public copy
- fixing a typo
- updating a single small content claim

## Boundaries

- Do not use this for feature work, redesigns, multi-file refactors, or ambiguous changes.
- Do not push to any remote without explicit confirmation.
- Still use normal commit hygiene: inspect status, stage only relevant files, run applicable checks, and include required trailers.
