---
name: single-responsibility-commits
description: Use when staging files for a commit — verify each commit touches only one logical concern. If unrelated files are staged together, split them into separate commits.
---

# Single Responsibility Commits

## Overview

Each commit should represent one logical change. If you're staging files that address different concerns, split them into separate commits — one per concern. This follows the same principle as single-responsibility in code: a commit should have one reason to change.

## When to Use

- Staging multiple files for a commit
- Running `git add` with multiple files
- Reviewing your staged changes before committing

## Core Rule

**One logical change per commit.** If you can't describe the commit in a single sentence that covers all the staged files, you need more commits.

## Checklist

- [ ] List the staged files: `git diff --cached --name-only`
- [ ] Do all files serve the same purpose? If not, split.
- [ ] Can you describe the commit in one sentence that covers every staged file? If not, split.
- [ ] Are there documentation files mixed with code changes? If so, split (`docs:` vs `feat:`).
- [ ] Are there generated/lockfile changes mixed with intentional changes? If so, split.

## Common Splits

| Group A | Group B | Commit types |
|---------|---------|-------------|
| Implementation code | Tests for it | `feat:` + `test:` (or squash if tightly coupled) |
| Feature A | Feature B | Two `feat:` commits |
| Code changes | Documentation | `feat:` + `docs:` |
| Refactoring | Feature work | `refactor:` + `feat:` |
| Skill A | Skill B | Two `docs(ai):` commits |

## Red Flags

- "They're both small changes" — Size doesn't determine splitting. Unrelated = split.
- "It's faster to batch them" — Faster now, harder to revert or cherry-pick later.
- "They're in the same file" — Same file can contain multiple logical changes. Consider splitting into separate commits even for the same file if the changes are unrelated (commit with `-p` for partial staging).
