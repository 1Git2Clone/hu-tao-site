---
name: read-the-full-pattern-first
description: Use before modifying any existing file — read its entire current content end-to-end first. Understand the complete structure before planning any change.
---

# Read the Full Pattern First

## When to Use

- Before editing a file you haven't read in full this session
- Before modifying a component template, type definition, or data file
- Before adding a new entry to an existing array or map
- Before changing a CSS class or Tailwind variant on an existing element

## Core Rule

**Never edit based on a skim.** Reading the first 30 lines or searching for a specific pattern is not enough. Read the entire file from top to bottom before touching anything. You need to understand what ELSE is in the file that your change might interact with.

## Checklist

- [ ] Read the entire file end-to-end (use `Read` with no offset)
- [ ] Identify: what does this file export? What imports does it have? What patterns does it follow?
- [ ] Identify: are there conditionals, edge cases, or responsive variants that your change might affect?
- [ ] Only after reading the full file: plan your change.

## Common Mistakes

| Mistake                                                       | Fix                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| Reading only the section you plan to change                   | Read the full file — your change may affect an unrelated section |
| Searching for a pattern and editing the match without context | Read the surrounding 50+ lines to understand the structure       |
| Assuming a file follows a simple pattern without verifying    | Every file has quirks. Read to find them before changing them.   |
| Editing based on what a subagent told you about the file      | Read the file yourself — subagents can miss details              |

## Red Flags

- "I already know what this file looks like" — Read it again. Memory drifts.
- "I'll just check the relevant lines" — You don't know which lines are relevant until you've read the whole thing.
- "I read this file earlier in the session" — If you made changes since then, read it again.
