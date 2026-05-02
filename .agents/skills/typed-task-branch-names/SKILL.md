---
name: typed-task-branch-names
description: Use when creating or renaming git branches in this repository.
---

# Typed Task Branch Names

## Rule

Branch names must start with a Conventional Commit-style type followed by a
slash and a short task slug.

## Format

```text
<type>/<task>
```

Examples:

- `feat/refine-about-me-ai-positioning`
- `fix/about-page-copy`
- `docs/update-agent-workflow`

## Checklist

- Choose the type before creating the branch.
- Use the same type family that would make sense for the eventual primary commit.
- Do not create branches named only after the task slug.
- If a branch is created incorrectly, rename it before continuing work.
