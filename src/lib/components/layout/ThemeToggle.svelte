<script lang="ts">
  import { flushSync } from "svelte";
  import { toggleMode, mode } from "mode-watcher";

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
    document.startViewTransition(() => flushSync(toggleMode));
  }
</script>

<button
  onclick={toggle}
  class="relative -mr-2 flex size-10 items-center justify-center sm:mr-0"
  aria-label="Toggle theme"
>
  <span class="absolute inset-0"></span>
  <span
    class="flex items-center justify-center text-2xl leading-none text-accent transition-colors duration-200 hover:text-accent-hover"
    style={mode.current === "dark" /* align font in the center */
      ? `transform: translateX(-2.65px);`
      : `transform: translateX(-3.9px);`}
  >
    {#if mode.current === "dark"}
      
    {:else}
      
    {/if}
  </span>
</button>
