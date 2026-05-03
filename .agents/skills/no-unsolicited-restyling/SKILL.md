---
name: no-unsolicited-restyling
description: Use when modifying existing UI components or sections — the task is to add content or functionality, not to redesign the visual structure unless explicitly requested.
---

# No Unsolicited Restyling

## Overview

When extending an existing page or component, preserve its visual structure. If the task says "add a project card" or "add a section", you add data to the existing pattern — you don't invent a new card layout or replace the template. The existing structure was put there deliberately by someone who's already made those design decisions.

## When to Use

- Adding new items to an existing list or grid
- Extending a page with a new section alongside existing ones
- Modifying a data file to add entries to an array
- Any task where "add" appears but doesn't say "redesign" or "replace"

## Core Rule

**Adding data ≠ redesigning the template.** If the task says "add a projects section with cards", first check whether a project card pattern already exists in the codebase. If it does, use it. The only reason to change the card structure is if the task explicitly says "redesign the cards" or "change the layout".

## Checklist Before Modifying Existing UI

- [ ] Is there an existing component or loop that renders similar items? Use it.
- [ ] Does the existing structure handle the new data correctly? If yes, don't change it.
- [ ] Would adding to the existing data array be sufficient? That's the default path.
- [ ] If you're tempted to replace a template, stop — did anyone ask for that?

## Common Mistakes

| Mistake                                                                                                   | Fix                                                                                                   |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Replacing a working card template with a simpler one because "the new data doesn't need all those fields" | Use the existing template — unused fields are handled by conditionals (`{#if}`)                       |
| Thinking "this structure is overcomplicated for what we need now"                                         | Not your call. Keep the existing structure.                                                           |
| Removing images, tech stack breakdowns, or metadata because "the new projects don't have those"           | The existing projects have them. Add new projects with empty fields rather than gutting the template. |
| Splitting a single section into multiple sub-sections without instruction                                 | Add content within the existing flow.                                                                 |

## Red Flags

- "The existing pattern is too complex for just adding data" — Use it anyway.
- "I'll simplify the cards while I'm at it" — Don't. Simplification is a separate task.
- "The old structure doesn't look professional enough" — Not your judgment to make.
- "I'll restructure and add content in one commit" — Those are two different changes.
