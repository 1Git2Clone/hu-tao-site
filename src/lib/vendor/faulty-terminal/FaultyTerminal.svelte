<script lang="ts">
  import { untrack } from "svelte";
  import { createRenderer, type Renderer } from "./renderer";
  import { toSettings, type TerminalOptions } from "./settings";

  type Props = Partial<TerminalOptions> & {
    class?: string;
    /** Called once when WebGL 2 is missing or a shader fails to build. */
    onunsupported?: () => void;
  };

  let { class: className = "", onunsupported, ...options }: Props = $props();

  const settings = $derived(toSettings(options));

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let renderer: Renderer | null = null;

  // Built once per mount. Later settings reach it through update() below.
  $effect(() => {
    renderer = untrack(() => createRenderer(container, canvas, settings));
    if (!renderer) {
      untrack(() => onunsupported?.());
      return;
    }
    return () => {
      renderer?.destroy();
      renderer = null;
    };
  });

  $effect(() => {
    renderer?.update(settings);
  });
</script>

<div
  bind:this={container}
  class={["relative h-full w-full overflow-hidden", className]}
>
  <canvas
    bind:this={canvas}
    class="absolute inset-0 block h-full w-full"
    aria-hidden="true"
  ></canvas>
</div>
