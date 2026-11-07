# Behaviour contracts

The browser tests protect the header, search, theme, article layout, and copy
controls. They use Chromium and the site's real CSS. Assertions read observable
state, computed styles, or geometry. No test waits a fixed animation duration.

## Run locally

Run commands in the Nix development shell:

```sh
nix develop -c pnpm install --frozen-lockfile
nix develop -c pnpm exec playwright install chromium
nix develop -c pnpm run test:components
nix develop -c pnpm run build
nix develop -c pnpm run test:e2e
```

On NixOS, use an installed Chrome executable instead of Playwright's Linux
download. Set `CHROME_PATH` to its absolute path for either browser command.
`XDG_CACHE_HOME=/tmp/hu-tao-check-cache` can provide a writable Nix cache in a
restricted shell. CI installs the Chromium version selected by the locked
Playwright dependency.

The CI `browser-tests` job runs the component suite and the production page
suite. It uploads traces and failure screenshots when a test fails. Tests have
no retries. Performance checks run in separate jobs.

PR deployments include the authored `test-*` blog posts, as local development
does. Netlify's deploy-preview context sets `VITE_INCLUDE_TEST_POSTS=true`
at build time. Main deployments and the CI performance/browser checks use
production content and exclude those posts. To inspect the preview content
locally, run `VITE_INCLUDE_TEST_POSTS=true nix develop -c pnpm run build`,
then start the preview server.

## State and ownership

| Component            | States and events                                                               | Ownership rule                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phone navigation     | Closed ↔ open on button click; Escape or navigation → closed                    | `isOpen` controls both `inert` and `aria-expanded`. Escape from the open menu returns focus to its button.                                                                       |
| Terminal copy        | Ready → clipboard pending → feedback → ready                                    | Only the latest request can start feedback. A successful repeat restarts its timer. Destruction clears it and ignores pending completions.                                       |
| Article heading copy | Same copy lifecycle, with a heading as the feedback target                      | One heading owns the mark. A late request cannot move it back to an older heading.                                                                                               |
| Blog search          | URL → draft; input → draft and debounced URL write; navigation → restored draft | Input owns the pending timer. A write consumes its own URL update once, so it cannot overwrite newer input. History remains authoritative afterward.                             |
| Theme toggle         | Idle → view transition → idle; another toggle replaces ownership                | Only the newest transition removes the ripple class. Old icon fades are cancelled before their target opacity is read. Completion, rejection, and destruction release resources. |
| Article sidebars     | Idle → scheduled measurement → idle on scroll, resize, or document size change  | At most one animation frame is pending. Both sidebars inherit the same measured footer overlap. Destruction removes listeners, the observer, and the frame.                      |

Page navigation also records the newest navigation before starting a snapshot.
This includes same-page and reduced-motion navigation. A superseded snapshot
cannot release an older route after Back has restored a newer one.

The current SvelteKit client checks its navigation token only after the DOM
swap following `onNavigate`. The guard therefore leaves a superseded
navigation promise unsettled. Remove this workaround when Kit checks the token
before that swap. The code comment identifies the exact boundary.

The navigation boolean and sidebar measurement remain independent state. A
state-machine library would add no useful constraint here. Request identity and
timer ownership protect the asynchronous copy and transition paths.

## Test boundaries

`tests/components/` uses `vitest-browser-svelte`. Link and copy tests mount the
real components. Search tests mount the real blog page and pagination with 25
posts. Only the SvelteKit router boundary is replaced: a reactive `SvelteURL`
delivers navigation changes, and a deferred navigation reproduces slow URL
commits. Fixture posts do not enter the site's content or production routes.

`tests/e2e/` uses Playwright against a production build. It checks phone and
desktop geometry, menu lines and focus, theme icons and rapid input, collapsed
search counts, browser history, sidebar bounds, semantic colours, and page
transitions with motion enabled and reduced.

Layout and interaction tests select the site's artwork fallback. This avoids
making software WebGL speed a prerequisite for CSS animation assertions. The
separate renderer smoke test leaves WebGL enabled and checks initialization,
context health, and a theme change. Performance measurements record their own
renderer and browser conditions.

`tests/types/tech.ts` makes `svelte-check` fail if technology keys widen to
`string`. The existing assert-based checks still run through `pnpm test`.

## Regression evidence

The first component run against the merged code failed the repeated-copy
interval test and reported an unhandled clipboard rejection. The first
production run failed to write the typed search query into the URL. Those
failures were observed before the fixes. Further tests exercise deferred
navigation, rejected transitions, out-of-order clipboard completions, and
resource cleanup.

Restoring the old heading-copy action made three tests fail and produced an
unhandled clipboard rejection. Restoring the old navigation made three of four
phone-menu tests fail. Both fixes were restored and their tests passed.

Fast Back was tested five times per motion setting. Before the page-transition
guard, all five runs with motion enabled left the old page visible behind the
new URL. After the guard, all ten runs passed. The search, theme, article, and
page-transition specs also passed against the resulting production build.

Earlier changes informed the geometry contracts: the centred phone title,
menu-to-X lines, sun/moon cross-fade, collapsed count row, card outros, and
article/sidebar alignment all remain covered. Tests check the resulting UI
instead of matching a source string or a fixed screenshot.
