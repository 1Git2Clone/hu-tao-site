<script lang="ts">
  import { mode, theme } from "mode-watcher";
  import FaultyTerminal from "$lib/vendor/faulty-terminal";

  // app.html adds .webgl when the browser has WebGL 2, and layout.css then hides
  // the background art. If the terminal still cannot start, the art comes back.
  const showArt = () => document.documentElement.classList.remove("webgl");

  // The renderer needs the token's value, not var(). Read it once the page has
  // its styles; the terminal waits for it, so it never starts in the default tint.
  let tint = $state<string>();
  $effect(() => {
    // Reading these applies ModeWatcher's root attributes before sampling CSS.
    // Custom palettes use data-theme; mode still selects the shader's ink mode.
    void mode.current;
    void theme.current;
    tint = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-terminal-tint")
      .trim();
  });
</script>

<!-- The look comes from the React Bits customizer. -->
<div class="pointer-events-none fixed inset-0 -z-1">
  {#if tint}
    <FaultyTerminal
      {tint}
      scale={3}
      digitSize={1}
      timeScale={1}
      curvature={0}
      vignette={0.5}
      brightness={0.75}
      scanlineIntensity={0.5}
      mouseReact={false}
      lightMode={mode.current === "light"}
      onunsupported={showArt}
    />
  {/if}
</div>
