---
name: widen-to-fit-is-a-smell
description: Use when a new piece of data doesn't match an existing type-safe function signature — instead of widening the parameter to string or any, make the data fit the existing contract.
---

# Widen-to-Fit Is a Smell

## When to Use

- A type-safe function or snippet rejects your new data type
- You're tempted to change `(keyof typeof MAP)[]` to `string[]`
- You're tempted to add `as any` or `as string` to make a type error go away

## Core Rule

**When a typed contract rejects your data, fix the data — not the contract.** If `License[]` doesn't fit `(keyof typeof TECH_URLS)[]`, add licenses to `TECH_URLS`. If a new project field isn't in the interface, add it to the interface — don't change the renderer to use `any`.

The function signature was deliberately narrow for a reason. Widening it to `string[]` removes type safety for every existing call site, not just your new one.

## Checklist

- [ ] Can the existing contract accept my data if I fill a gap in the underlying map/union? (e.g., add to `TECH_URLS`, add to the union type)
- [ ] Would widening the parameter silently bypass type checking for all future callers?
- [ ] Is there a more specific fix that preserves the narrow contract?

## Common Mistakes

| Temptation | Right action |
|-----------|-------------|
| Change `(keyof typeof X)[]` to `string[]` | Add your new keys to `X` instead |
| Add `as any` cast | Find the actual type mismatch and fix it |
| Replace typed map with a looser `Record<string, string>` | Keep the const map, add your missing keys |

## Red Flags

- "I'll just widen the type real quick" — That widens it for everyone.
- "It's just one parameter, it doesn't matter" — It matters for every future call.
- "The existing contract is too strict anyway" — Not your judgment to make.
