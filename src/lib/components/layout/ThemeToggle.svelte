<script lang="ts">
  import { flushSync, onDestroy } from "svelte";
  import { toggleMode } from "mode-watcher";
  import { TILE } from "./SocialLinks.svelte";
  import NerdIcon from "$lib/components/icons/NerdIcon.svelte";

  let ripple: ViewTransition | undefined;
  let fades: Animation[] = [];
  let disposed = false;
  const icons: HTMLElement[] = [];

  // The sun and moon cross-fade. ModeWatcher turns off CSS transitions while
  // the theme changes, but not animate(), so the fade runs here once the dark
  // class has flipped. The class alone sets which icon shows.
  function fadeIcons() {
    for (const fade of fades) fade.cancel();
    fades = [];
    for (const icon of icons) {
      const shown = getComputedStyle(icon).opacity !== "0";
      fades.push(
        icon.animate(
          { opacity: shown ? [0, 1] : [1, 0] },
          { duration: 200, easing: "ease" },
        ),
      );
    }
  }

  // The new theme grows out of the button as a circle. The old page is a still
  // snapshot, but the new one is live, so the terminal keeps moving inside it.
  function toggle(event: MouseEvent) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      toggleMode();
      if (!reduced) fadeIcons();
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    // The circle is a CSS animation in layout.css, which reads these. Firefox
    // starts an animate() call one frame late and shows the whole new theme.
    const root = document.documentElement.style;
    root.setProperty("--ripple-x", `${x}px`);
    root.setProperty("--ripple-y", `${y}px`);
    root.setProperty("--ripple-radius", `${radius}px`);

    // The new snapshot is taken when the callback returns, so the theme class
    // must be on <html> by then. ModeWatcher's synchronousModeChanges does that.
    // .theme-ripple keeps the page in the root snapshot, so it ripples too, and
    // keeps the page change animation in layout.css out of this transition.
    // A second click skips this transition, so only the newest one removes it.
    const html = document.documentElement;
    html.classList.add("theme-ripple");
    const transition = document.startViewTransition(() => {
      if (disposed) return;
      flushSync(toggleMode);
      fadeIcons();
    });
    ripple = transition;
    // Rapid input skips older snapshots. Their ready promises reject even
    // though the update callback still runs and finished still settles.
    void transition.ready.catch(() => {});
    const finish = () => {
      if (ripple !== transition) return;
      ripple = undefined;
      html.classList.remove("theme-ripple");
    };
    void transition.finished.then(finish, finish);
  }

  onDestroy(() => {
    disposed = true;
    ripple?.skipTransition();
    if (ripple) document.documentElement.classList.remove("theme-ripple");
    ripple = undefined;
    for (const fade of fades) fade.cancel();
  });
</script>

<button onclick={toggle} class="group" aria-label="Toggle theme">
  <span class={TILE}>
    <!-- SVGs, not font glyphs: an SVG box centres the icon in the tile. Both
         share one grid cell and the dark class picks one, so the server
         already renders the right one. -->
    {#each ["oct-sun", "oct-moon"] as const as name, i (name)}
      <span
        bind:this={icons[i]}
        class={[
          "col-start-1 row-start-1 flex",
          name === "oct-sun" ? "dark:opacity-0" : "opacity-0 dark:opacity-100",
        ]}
      >
        <NerdIcon {name} width={24} height={24} />
      </span>
    {/each}
  </span>
</button>
