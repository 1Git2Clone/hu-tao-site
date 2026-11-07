<script lang="ts">
  import { flushSync } from "svelte";
  import { toggleMode, mode } from "mode-watcher";
  import { TILE } from "./SocialLinks.svelte";
  import NerdIcon from "$lib/components/icons/NerdIcon.svelte";

  let ripple: ViewTransition | undefined;

  // The new theme grows out of the button as a circle. The old page is a still
  // snapshot, but the new one is live, so the terminal keeps moving inside it.
  function toggle(event: MouseEvent) {
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      toggleMode();
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
    const transition = document.startViewTransition(() =>
      flushSync(toggleMode),
    );
    ripple = transition;
    transition.finished.finally(() => {
      if (ripple === transition) html.classList.remove("theme-ripple");
    });
  }
</script>

<button onclick={toggle} class="group" aria-label="Toggle theme">
  <span class={TILE}>
    <!-- SVG, not the font glyph: an SVG box centres the icon in the tile. -->
    <NerdIcon
      name={mode.current === "dark" ? "oct-moon" : "oct-sun"}
      width={24}
      height={24}
    />
  </span>
</button>
