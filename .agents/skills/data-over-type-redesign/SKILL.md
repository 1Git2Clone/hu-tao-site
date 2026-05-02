---
name: data-over-type-redesign
description: Use when adding entries to an existing data file (projects list, config map, enum) — append to the existing array or map. Do not restructure the surrounding types, interfaces, or rendering code.
---

# Data Over Type Redesign

## When to Use

- Adding a new entry to a `const` array of objects
- Appending a value to a union type or a key to a `const` map
- Adding a new case to an existing data structure

## Core Rule

**Adding data does not require redesigning types.** If the task is "add a new project" or "add a new language", you add one entry to the existing array. You do not rewrite the interface, change the type definitions, or modify the renderer — unless explicitly asked.

## Checklist

- [ ] Does the existing type accept the new value? If yes, stop — just add the data.
- [ ] Does the existing renderer handle the new field correctly? If yes, stop — just add the data.
- [ ] Are you tempted to "clean up" the surrounding types while you're here? Don't. That's a separate task.
- [ ] Are you tempted to change the interface so the data entry is "cleaner"? Don't. The interface is fine.

## Common Mistakes

| Situation | Right action |
|-----------|-------------|
| Adding a project with `isPrivate: true` | Add it to `PROJECTS` array. The `Project` class already handles it. |
| Adding a new license value | Add the string to the `License` union type. Don't touch `TECH_URLS` or the snippet unless the new type requires a link. |
| Adding a field to a type | You're probably over-engineering. Append data, don't expand interfaces. |

## Red Flags

- "While I'm adding this entry, I should restructure the type" — No. Add the entry.
- "The existing interface is messy, let me clean it up" — Separate task.
- "I'll make the types cleaner first, then add the data" — You're procrastinating. Add the data.
