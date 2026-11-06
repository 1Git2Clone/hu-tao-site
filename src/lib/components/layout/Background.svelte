<script lang="ts">
  import { mode } from "mode-watcher";
  import FaultyTerminal from "$lib/vendor/faulty-terminal";

  // app.html adds .webgl when the browser has WebGL 2, and layout.css then hides
  // the background art. If the terminal still cannot start, the art comes back.
  const showArt = () => document.documentElement.classList.remove("webgl");
</script>

<!-- The look comes from the React Bits customizer. -->
<div class="pointer-events-none fixed inset-0 -z-1">
  <FaultyTerminal
    tint="#642931"
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
</div>
