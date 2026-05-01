---
name: committing-with-trailers
description: Use when making any git commit — ensure all required trailers (Co-authored-by, Signed-off-by, etc.) are present and correctly formatted before the commit is created.
---

# Committing With Trailers

## Overview

Every commit must carry the appropriate `Co-authored-by:` (and any other required) trailers. Trailers are not optional — they are part of the commit contract. A commit without a trailer is incomplete.

## When to Use

- Creating any git commit, whether manually or via a subagent
- Amending or rebasing commits
- Running filter-branch or other history-rewriting commands that modify commit messages

## Core Rule

**Every commit you author directly must have trailers.** Subagents should handle their own trailers, but the orchestrator is responsible for verifying them on any commit it makes directly.

## Checklist Before Any Commit

- [ ] If you are the author (orchestrator committing directly), add `--trailer "Co-authored-by: <Model Name> <email>"` to the commit command
- [ ] Verify the trailer syntax is exact: `Co-authored-by: Name <email>` — no missing `>`, no typos
- [ ] If using `filter-branch` with `--msg-filter`, double-check the echo/sed string for correct angle brackets
- [ ] If a subagent made the commit, verify the trailer is present in the log after the fact

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `git commit -m "msg"` without `--trailer` | Always use `--trailer "Co-authored-by: ..."` |
| Trailer missing closing `>` in a sed/echo string | Test the string with `printf` before running filter-branch |
| Assuming subagents always add trailers | Verify with `git log --format='%b' -1 | grep 'Co-authored-by'` |
| Amending without re-adding the trailer | `git commit --amend --no-edit --trailer "Co-authored-by: ..."` |

## Red Flags

- "I'll add it after" — Add it now, in the commit command, not later
- "This is just a quick fix commit" — Quick commits need trailers most (easy to miss)
- "The subagent already handled it" — Verify, don't assume
