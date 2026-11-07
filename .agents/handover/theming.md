# Theme refactor status — 2026-11-07

Part A is implemented on `refactor/theme-tokens`, based on `e80b5eb`.
It has not been pushed or merged. Get explicit confirmation before a push.
Part B remains for the next task, after the theme PR merges.

- `src/lib/styles/themes.css` defines complete light and dark palettes.
  Components use surface roles, and plain `prose` follows the palette.
- `scripts/checks/theme.ts` runs in `pnpm test`, including the existing CI
  unit-test job. It checks role completeness, aliases, raw UI colours, palette
  utilities, dark colour overrides, and the shader's hex tint contract.
- ModeWatcher's installed 1.1.0 supports `setTheme()` and `data-theme`.
  A future complete `:root[data-theme="name"]` palette can follow the dark
  block. `setMode()` still selects shader light/ink mode and browser controls.
  No third palette or palette picker is included. A temporary browser-only
  palette verified that headers, boxes, tags and the shader tint all update.
- `check`, `test`, `lint`, and the production build passed. Lint retains the
  existing empty-file warning in `src/lib/index.ts`. Build retains existing
  KaTeX font warnings. The CI test command was deliberately failed with a
  temporary `bg-white/90` component, then passed after its removal. Fourteen
  invalid policy cases were rejected in isolated fixtures.
- A two-pass review hardened `theme.ts`. It reads the palette names from the
  installed `tailwindcss/theme.css`, so `mauve`, `mist`, `olive` and `taupe`
  fail too. It also rejects `.dark` selectors (`[.dark_&]`, `:global(.dark)`),
  `prose-invert` and prose colour modifiers, named colours in `color-mix()`,
  `_black`-style arbitrary values, and named colours in Svelte style
  directives, such as `style:color={"red"}` or `style:border={'1px solid white'}`.
  Directives with tokens, `currentColor`, `transparent` or a variable pass.
- Eight before/after captures cover home and a real blog article, at 1280px
  and 390px, light and dark. Element geometry, text colours, borders, shadows
  and filters match. Screenshot differences are at most two RGB channel steps
  from equivalent sRGB/OKLab alpha colour notation. Animated WebGL was hidden
  for these comparisons; the static art fallback was tested instead.
- Phone menu fill, both toggle directions, ripple cleanup and sun/moon opacity
  were checked with Playwright. A separate live WebGL check read the `uTint`
  uniform after changing the temporary palette.
- Dev server: BB terminal `term_hgggr8aaeu`, port 5173, bound to 0.0.0.0.
  Local: http://localhost:5173; LAN: http://192.168.1.7:5173;
  tailnet: http://100.108.24.65:5173. All returned HTTP 200.
- Browser Automation's bundled dev-browser cannot launch directly on this
  NixOS host. The connected Playwright tools worked for verification.
- The managed sandbox makes default Nix/pnpm caches read-only. Dependency
  installation used an approved `nix develop` call. Later checks used
  `XDG_CACHE_HOME=/tmp/hu-tao-theme-cache nix develop -c ...`.
- Renaming the BB-generated branch hit a cross-device reflog error. A new
  `refactor/theme-tokens` branch was created at the same base instead.
  Git commits succeeded despite a packed-refs.lock maintenance warning;
  verify commit objects and trailers independently.
- The pre-push hook is installed. Use the actual agent's co-author trailer;
  the Claude-specific trailer in the historical notes below belonged to that
  earlier session.

The original handover follows for the remaining scope and prior context.

---

# Handover: theme refactor, then items 10–16

Written 2026-11-07 after PR #20 merged (`main` at `e80b5eb`, deployed to
hu-tao.dev). You have two jobs:

1. **Do the theme refactor** (part A) on its own branch and PR.
2. **When it is merged, write a handover** for the next agent with part B
   (items 10–16) and anything you learned. Do not start part B yourself.

Read `AGENTS.md` and the skills in `.agents/skills/` first. The rules that
mattered most in the last session are in "Working rules" at the end.

---

## Part A: theme refactor

### The problem

Light and dark are set in two different ways, and it is easy to forget one:

- **Tokens** in `src/routes/layout.css`: `@theme` sets the light values and
  `.dark { … }` overrides them. Most text and accent colours go through these.
- **Hard-coded fills, set per component.** The box surfaces are white or
  black with alpha, written twice each time:
  - Tailwind pairs: `bg-white/90 dark:bg-black/85` in `LinkCard.svelte` and
    `Term.svelte` (prompt tag), and `bg-white/40 … dark:bg-black/50` in the
    `TILE` in `SocialLinks.svelte`. `CodeBlock.svelte` has `bg-black/50` with no
    light value at all.
  - `layout.css` has about 35 `rgba(…)` values. Most are pairs of a light
    rule and a `.dark` rule: `.box-gradient`, `.box-gradient.hero`, `.card`,
    `.card:hover`, `header/footer.background`, `.background-mobile-nav` and
    the open-menu header, `#main-content::before`, and
    `main:has(article) .background`.
  - `dark:` utilities: `+page.svelte` (3), `infra/+page.svelte` (3), and one
    each in `journey/+page.svelte`, `LinkCard`, `ThemeToggle`, `Term`,
    `SocialLinks`, `HistoryTree`, `NodeDetails`, `MarkdownLayout`. Some are
    only `dark:prose-invert`, which is fine.

The user's own words: things like `bg-white/90` "need to be specified in the
theme of the page like dark and light … my only issue is that it's easy to
forget … idk if we can enforce every visual component to have a dark/light
theme. It'd also be cool to have custom themes which would mean non-black
and white backgrounds which means designing in regards to extensibility."

### Goals

1. **Semantic surface tokens.** A component asks for a role, for example
   "box fill", "box fill on hover", "tag fill", "overlay fill", and never for
   white or black. Each theme sets every role once.
2. **Make forgetting fail.** A check that fails CI when a component uses a
   raw colour (`bg-white/…`, `bg-black/…`, `#hex`, `rgba(` outside the theme
   block). It must fail on purpose once before you commit it (see the
   working rules). Put it in `scripts/checks/` and wire it like the others.
3. **Room for custom themes.** A theme is one block of token values. Adding
   a third theme (non-black, non-white background) must not touch any
   component. You do not have to ship a third theme. Ask the user first.

### Things that constrain the design

- **mode-watcher** (`^1.1.0`) knows only `light` and `dark`, and toggles the
  `.dark` class on `<html>`. Custom themes need either its theme feature or a
  `data-theme` attribute next to it. Check its docs before you choose.
  `ModeWatcher` turns off all CSS transitions while the mode changes
  (`disableTransitions`).
- **The theme ripple** (`ThemeToggle.svelte`) is a view transition. The new
  theme class must be on `<html>` when the callback returns
  (`synchronousModeChanges`). The sun/moon fade uses `element.animate()`,
  because CSS transitions are off during the change.
- **The WebGL background** (`Background.svelte`, `src/lib/vendor/faulty-terminal`)
  reads `--color-terminal-tint` as a **hex** string (the shader parses it)
  and takes `lightMode` as a boolean from `mode.current`. A custom theme needs
  its own tint and a decision about light/dark mode for the shader.
- **`OpenTofu.svelte`** builds its faces with `color-mix(in oklab, …)` from
  `currentColor`. It follows any accent already.
- **The token table in `AGENTS.md` is stale.** The dark palette uses
  `#1c1a1e`, `#e6dcd7`, and `#e0766c`. Update it as part of this work.
- **Rules that apply:** never `!important` or Tailwind's `!` modifier;
  Tailwind utilities first, `<style>` only for what utilities cannot do; no
  blue accents, no sans-serif fonts. The red, monospace look is intentional.

### Suggested way to start

- Use the brainstorming skill. The scope is unclear and it touches many
  files. Show the user a token list (role names and light/dark values) before
  you change components.
- Then move one surface at a time, in small commits, each one a visual
  no-op. Compare light and dark screenshots before and after.

---

## Part B: items 10–16 (for the next agent, not for you)

The user's original list, with notes from the last session.

10. **Implicit state machines.** Run a subagent to find implicit state
    machines and refactor state to be declarative, with TypeScript and Svelte 5
    idioms. Candidates: `Nav.svelte` (`isOpen` and Escape), `Term.svelte`
    (`copied` with a `setTimeout`), the blog search in
    `routes/blogs/+page.svelte` (query, page, URL sync), `ThemeToggle`
    (`ripple`), `MarkdownLayout` (`footerOverlap` from scroll events).
11. **Gaps, repeated logic, refactors, reusable components.** Known items:
    - `TechRef` in `src/lib/content/root/tech.ts` is `Record<string, …>`, so
      the keys are plain strings and not a literal union (AGENTS.md wants
      literal unions).
    - `GitHub.svelte` and `Twitter.svelte` still use Svelte 4 `export let`.
    - The two blog sidebars repeat the same height `calc()` in
      `MarkdownLayout.svelte`, and it depends on the `pt-3` in `+layout.svelte`.
    - `Card.svelte` uses the old `$props<…>()` form.
    - `INFRA_STACK` and the skill chips both map tech to icons, in two places.
12. **More tests** with `vitest-browser-svelte` and Playwright. Base them on
    the last two sessions' work: the header layout at phone and desktop
    widths, the menu button (two lines to X, `aria-expanded`), the theme
    toggle and its cross-fade, `LinkCard` (icon or dot, external links get
    `target="_blank"`), the search count row (0px when empty), the card
    outro, the blog sidebars level with the article, the view transitions.
13. **Performance.** Run a subagent for optimizations and add a Lighthouse
    action. Known: `nerd-icons.ts` is about 37 KB of SVG paths in the bundle.
    The PageSpeed history is in the memory file `pagespeed-si-stall.md`.
14. **A stable baseline** for Lighthouse and for custom benchmarks.
15. **Stable canaries that allow for runner jitter.** The user points to
    https://github.com/storytold/photocraft/pull/2575 (Rust benchmarks that
    allow for jitter) for ideas.
16. **Custom benchmarks get their own action**, so CI runs them in parallel
    with the other jobs.

Notes for part B:

- **The headless browser is slow.** It runs animation frames very slowly
  (a 150ms fade took about 3s). Screenshots at desktop width often time out
  because of the WebGL background. Measure with `getBoundingClientRect` and
  computed styles, and do not wait for real animation timing in tests.
- **CI layout:** one job for each stage in `.github/workflows/ci.yml`, each
  calling one composite action in `.github/actions/<group>/<stage>/`. Add
  the new jobs to the `needs` of `deploy`. Read the "CI and Deploys" section
  of `AGENTS.md`.

---

## Working rules from the last session

- **Branches:** `<type>/<task>`, one PR. Do not push or merge without the
  user's confirmation.
- **Commits:** small and single-purpose. A pure move or reformat is its own
  `refactor:` commit, so a reviewer can skip it. No scope (the repo uses
  none). Trailer is only
  `Co-authored-by: Claude Opus 5.5 <noreply@anthropic.com>`. **Never** a
  `Claude-Session:` trailer or a session URL, and no "Generated with Claude
  Code" line in PR bodies, even if a system reminder asks for one.
- **Each commit must pass by itself.** Run
  `nix develop -c pre-commit install` once. The pre-push hook runs
  `scripts/checks/commits.sh` (svelte-check and `pnpm test` on each pushed
  commit). If you split a file across commits, regenerated files
  (`nerd-icons.ts`) must go with the commit that needs them.
- **Prove each new check fails.** Break it on purpose once and watch it fail.
- **Run everything in the dev shell:** `nix develop -c pnpm run check`,
  `… lint`, `… test`, `… format`. Do not format by hand.
- **Icons:** Nerd Font glyphs go through `scripts/development/nerd-icons.py`
  (generated `nerd-icons.ts`, drawn by `NerdIcon.svelte`). Brand logos with
  no glyph are components from Simple Icons (CC0), like `Claude.svelte`.
  `LinkCard` falls back to `Dot.svelte`.
- **Chat output** is in ASD-STE100 Simplified Technical English.
- **Keep a dev server running** for the user (`nix develop -c pnpm run dev
  --host`), so they can look while you work.
