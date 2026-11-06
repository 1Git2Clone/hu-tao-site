<script lang="ts">
  import { toggleMode, mode } from "mode-watcher";
</script>

<button
  onclick={toggleMode}
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
