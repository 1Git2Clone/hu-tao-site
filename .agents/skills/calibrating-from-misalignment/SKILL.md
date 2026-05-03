---
name: calibrating-from-misalignment
description: Use when the user gives corrective feedback, states a convention, or points out a process gap — treat each statement about how work should be done as a potential skill signal. Skills are binding constraints, not optional documentation.
---

# Calibrating From Misalignment

## Overview

Skills are constraints, not nice-to-haves. When the user tells you how work should be done, encode that as a skill proactively. Do not wait for the user to ask for a skill by name.

## Trigger Conditions

Any of these means stop and evaluate whether a skill is needed:

- User says "we do X like Y" or "we only use X when Z"
- User says "this should have been X, not Y"
- User corrects your commit message, file structure, approach, style, or process
- User asks "why didn't you do X?" where X is a reasonable expectation
- User gives process feedback rather than just output feedback

Do NOT use for typos, one-off mistakes, or mechanical constraints better enforced by tooling.

## Core Pattern

```
Misalignment → skill that encodes the correct behavior
```

## Mandatory Checklist

Run this after every significant user correction or convention statement:

- [ ] Did the user tell me a convention or preference I do not already have encoded?
- [ ] Did I make an incorrect assumption about how they want work done?
- [ ] Would the same mistake likely recur in a fresh session?
- [ ] If yes to any of the above, write or update a skill before moving on.

No "I'll do it later." Skill first.

## Response Protocol

1. Acknowledge the gap briefly.
2. Evaluate whether the feedback should become a skill.
3. If yes, write or update the skill immediately.
4. Reference it in `AGENTS.md` if it should be discoverable project-wide.
5. Verify the skill file exists and is readable.

### Example Flow

```
User: "those should've been separate commits"
You: Write a `single-responsibility-commits` skill.
     "Committed as `.agents/skills/single-responsibility-commits/SKILL.md`."

User: "we only use raw CSS when styling is complex or for repeatable components"
You: Write a `tailwind-first-styling` skill.
     Add it to `AGENTS.md`.
```

## Rationale

Explicit skills are better than implicit lessons. Writing down the pattern means:

- The same gap won't resurface in a future session
- The rule is searchable and loadable
- Other agents working on the same project benefit from the same calibration
- The user does not have to keep re-explaining conventions

## Common Mistakes

| Excuse                                          | Reality                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| "I'll just remember next time"                  | You won't. Different session, different context.    |
| "It's too specific to encode"                   | Specific rules are the easiest to follow.           |
| "I'll fix it in the moment"                     | Fixing now ≠ preventing recurrence.                 |
| "The user didn't explicitly ask for a skill"    | They shouldn't have to. The feedback is the signal. |
| "I'll write the skill after I finish this task" | Later never comes. Encode it before moving on.      |

## Red Flags

- "I already understand what they want" — understanding is not encoding.
- "I'll adapt next time" — different session, same mistake.
- "This is too minor for a skill" — minor process gaps create recurring friction.
- "Let me fix the code first, then write the skill" — no, skill first.
