---
name: no-delayed-hash-scroll-fixes
description: Use when debugging hash-link scrolling, anchor offsets, SvelteKit navigation timing, or page-transition scroll issues.
---

# No Delayed Hash Scroll Fixes

## Rule

Do not fix bad hash-link landing positions by adding delayed programmatic
re-scrolls after navigation.

## Why

Delayed `setTimeout` / `requestAnimationFrame` scroll corrections create visible
double-scroll behavior: the browser or router scrolls once, then the app scrolls
again. That feels broken and is worse than the original offset issue.

## Preferred Fixes

- Fix the anchor target itself: put the `id` on the stable section/block that
  should land at the top of the viewport.
- Add explicit `scroll-mt-*` classes to the target element when the fixed/sticky
  header needs offset.
- Avoid global `scroll-behavior: smooth` when SvelteKit route transitions also
  animate page entry; smooth hash scrolling can compete with `in:fly`.
- Keep hash navigation single-pass: click link, land once, no correction jump.

## Avoid

- Do not add `afterNavigate` handlers that re-scroll to `page.url.hash`.
- Do not add delayed `setTimeout(...scrollIntoView...)` fixes.
- Do not use JavaScript scroll correction before exhausting CSS/anchor fixes.
