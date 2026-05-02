---
name: orchestrator-verification-gate
description: Use after dispatching subagents or making direct commits — verify the orchestrator's own output (trailers, merge structure, config changes) separately from subagent task output.
---

# Orchestrator Verification Gate

## When to Use

- After making a direct commit (not through a subagent)
- After running a `git merge`, `git rebase`, or `git filter-branch`
- After creating or modifying configuration files, gitignore, CI configs
- After any operation that the orchestrator performs itself rather than delegating

## Core Rule

**Subagent output and orchestrator output need separate verification gates.** A subagent task completing successfully does not mean the orchestrator's own commands were correct. The orchestrator's mistakes (wrong merge flags, missing commit trailers, incorrect git commands) are the orchestrator's responsibility to verify.

## Checklist

- [ ] Did I run any git commands directly? Verify: merge parents correct? Branch structure clean?
- [ ] Did I commit directly? Verify: `Co-authored-by` trailer present and correctly formatted?
- [ ] Did I modify a template or layout? Verify: responsive layout for 1, 2, 3, 4+ items?
- [ ] Did I change a CSS class or Tailwind variant? Verify: all screen sizes, odd/even counts?

## Common Mistakes

| Mistake | Prevention |
|---------|-----------|
| Forgetting `--trailer` on a direct commit | Always add `--trailer "Co-authored-by: ..."` on direct commits |
| Wrong merge parents (`--no-ff` vs fast-forward) | Verify with `git log --graph` before declaring done |
| Layout breaks only visible at certain item counts | Test with 1, 2, 3, and 4 items |
| Removing a CSS class that handled an edge case | Read the full template before modifying any class |

## Red Flags

- "The subagents did all the work, I just ran the merge" — The merge is your work. Verify it.
- "It's just a quick config change" — Quick changes skip verification most often.
- "The graph looks right at a glance" — Check merge parents explicitly with `git cat-file -p`.
