---
name: tailwind-first-styling
description: Use when writing component styles in a Tailwind CSS v4 Svelte project — prefer Tailwind utility classes over raw CSS in `<style>` blocks. Only use `<style>` for pseudo-elements, complex selectors, keyframes, or reusable component classes used across multiple elements.
---

# Tailwind-First Styling

## Overview

Default to Tailwind utility classes for all styling. Raw CSS in `<style>` blocks is a deliberate fallback, not a co-equal option. If a style can be expressed with Tailwind utilities, use Tailwind utilities.

## When to Use

- Writing any new component or modifying existing styles
- Reviewing code that adds a `<style>` block

**Use `<style>` only when:**

- Pseudo-elements (`::before`, `::after`, `::placeholder`, `::selection`)
- CSS `@keyframes` animations
- Complex selectors that Tailwind can't express (e.g. `:nth-child(2n+1)`, sibling combinators)
- `@media` queries that don't map to Tailwind breakpoints
- Reusable CSS class used by **multiple unrelated elements** (e.g. `.project-image-border` in `about-me/+page.svelte`)

## Core Pattern

### ❌ Bad — writing raw CSS for what Tailwind handles

```svelte
<span class="badge">New</span>

<style>
	.badge {
		position: absolute;
		top: 8px;
		right: 8px;
		padding: 2px 10px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-primary);
		background: var(--color-accent);
		border-radius: 4px;
		transform: skewX(-8deg);
		transition: transform 0.2s ease;
	}
	.parent:hover .badge {
		transform: skewX(-8deg) scale(1.05);
	}
</style>
```

### ✅ Good — Tailwind utilities for everything native

```svelte
<span
	class="absolute top-2 right-2 skew-x-[-8deg] rounded bg-accent px-2.5 py-0.5 text-xs font-bold tracking-wider text-primary uppercase transition-transform duration-200 group-hover:scale-105"
>
	New
</span>
```

### ✅ Still use `<style>` when Tailwind genuinely can't

```svelte
<h3 class="gradient-underline text-lg font-bold">Title</h3>

<style>
	.gradient-underline::after {
		content: '';
		position: absolute;
		inset: auto 0 0 0;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--color-accent),
			color-mix(in oklab, var(--color-accent) 40%, transparent)
		);
		border-radius: 2px;
	}
</style>
```

The `::after` pseudo-element is genuinely outside Tailwind's scope. Everything else — positioning, sizing, rounded corners, colors, gradient direction — was Tailwind-native.

## Quick Reference

| Raw CSS                                     | Tailwind Equivalent                    |
| ------------------------------------------- | -------------------------------------- |
| `position: absolute; top: 0; left: 0;`      | `absolute inset-0`                     |
| `position: absolute; top: 8px; right: 8px;` | `absolute top-2 right-2`               |
| `padding: 2px 10px;`                        | `px-2.5 py-0.5`                        |
| `font-size: 0.7rem;`                        | `text-xs`                              |
| `font-weight: 700;`                         | `font-bold`                            |
| `text-transform: uppercase;`                | `uppercase`                            |
| `letter-spacing: 0.05em;`                   | `tracking-wider`                       |
| `transform: skewX(-8deg);`                  | `skew-x-[-8deg]`                       |
| `transition: all 0.2s ease;`                | `transition-all duration-200 ease-out` |
| `color: var(--color-accent);`               | `text-accent`                          |
| `background: var(--color-accent);`          | `bg-accent`                            |
| `border-radius: 4px;`                       | `rounded`                              |
| `border-radius: 8px;`                       | `rounded-lg`                           |
| `box-shadow: 0 0 20px -4px;`                | `shadow-[0_0_20px_-4px]`               |
| `:hover { transform: scale(1.05); }`        | `hover:scale-105`                      |
| `.parent:hover .child { ... }`              | `group` + `group-hover:`               |
| `cursor: pointer;`                          | `cursor-pointer`                       |
| `z-index: 10;`                              | `z-10`                                 |

## Threshold Test

Before adding a `<style>` block, ask:

1. **Is this a pseudo-element or `@keyframes`?** → Yes: `<style>` is warranted
2. **Is this a complex selector Tailwind can't express?** (e.g. `:nth-child`, `:not()`, `+`, `~`) → Yes: `<style>` is warranted
3. **Is this a reusable class used by 2+ sibling elements in the same component?** → Maybe: `<style>` is acceptable for a single well-named class
4. **Is this a one-off style that maps to a Tailwind utility?** → Use the utility. No `<style>`.

If the answer to all four is "no", the style belongs inline as a Tailwind class.

## Common Mistakes

| Mistake                                                                                   | Fix                                                                                   |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Writing raw CSS for positioning (absolute, relative, inset, z-index)                      | Use `absolute`, `relative`, `inset-0`, `z-10` etc.                                    |
| Writing raw CSS for typography (font-size, weight, letter-spacing, text-transform, color) | Use `text-xs`, `font-bold`, `tracking-wider`, `uppercase`, `text-accent`              |
| Writing raw CSS for a hover effect (scale, translate, shadow)                             | Use `hover:scale-105`, `hover:-translate-y-1`, `hover:shadow-*`                       |
| Writing raw CSS for a single border-radius or padding value                               | Use `rounded`, `rounded-lg`, `p-4`, `px-2`                                            |
| Reaching for raw CSS first and only converting if abstracted                              | **Reverse the priority**: reach for Tailwind first, resort to raw CSS only when stuck |

## Red Flags

- "I'll just add it in `<style>` real quick, it's one element" — If one element, it's Tailwind-expressible
- "This is simpler with plain CSS" — It's usually not, you're just more comfortable with it
- "It's just a few lines of CSS" — Those few lines fragment the component's styling
- "I'll use a `<style>` block now and refactor later" — That never happens. Do it right the first time.
- "The Tailwind class string is getting long" — That's normal. Long class strings are preferable to fragmented CSS.
