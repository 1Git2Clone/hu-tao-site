---
name: calibrating-from-misalignment
description: Use when the user explicitly points out that your output didn't match their expectation — a commit was wrong, a file was misplaced, a pattern was violated. Treat that feedback as a process gap, not a one-off correction.
---

# Calibrating From Misalignment

## Overview

When the user points out that what you did doesn't match what they wanted, the correct response is to write a skill that prevents that specific gap from recurring. Complaints are a signal that your process is missing a rule — encode it.

## When to Use

- User says "this should have been X, not Y"
- User corrects your commit message, file structure, or approach
- User points out a pattern violation after you delivered work
- User asks "why didn't you do X?" where X is a reasonable expectation

Do NOT use for typos, one-off mistakes, or cases where the existing rules already cover it but you simply failed to follow them.

## Core Pattern

```
Misalignment → skill that encodes the correct behavior
```

### Response Template

When the user identifies a misalignment:

1. **Acknowledge the gap** briefly. Don't apologize at length.
2. **Write a skill** that captures the correct behavior. Put it in `.agents/skills/<skill-name>/SKILL.md`.
3. **Reference the skill** in `CLAUDE.md` or `AGENTS.md` if it's a recurring concern.
4. **Verify** by committing the skill.

### Example Flow

```
User: "those should've been separate commits"
You: Write a `single-responsibility-commits` skill.
     "Committed as `.agents/skills/single-responsibility-commits/SKILL.md`."
```

## Rationale

Explicit skills are better than implicit lessons. Writing down the pattern means:
- The same gap won't resurface in a future session
- The rule is searchable and loadable
- Other agents working on the same project benefit from the same calibration

## Common Mistakes

| Excuse | Reality |
|--------|---------|
| "I'll just remember next time" | You won't. Different session, different context. |
| "It's too specific to encode" | Specific rules are the easiest to follow. |
| "I'll fix it in the moment" | Fixing now ≠ preventing recurrence. |
