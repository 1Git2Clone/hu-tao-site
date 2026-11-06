<script lang="ts">
  import "./layout.css";
  import "$lib/styles/font.css";
  import { ModeWatcher } from "mode-watcher";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";

  import Seo from "$lib/components/layout/Seo.svelte";

  let { children } = $props();
</script>

<Seo />
<ModeWatcher />
<Header />

<main
  id="main-content"
  class="background relative mx-auto w-full overflow-x-hidden p-(--main-padding) text-justify"
  style="min-height: calc(100dvh - var(--header-height) - var(--footer-height));"
>
  <div class="grid-stack">
    {@render children()}
  </div>
</main>

<Footer />

<style>
  .grid-stack {
    min-height: calc(100dvh - var(--layout-chrome));
    display: grid;
    grid-template-areas: "stack";
    align-items: start;
  }

  .grid-stack > :global(*) {
    grid-area: stack;
    backface-visibility: hidden;
  }

  :global(html) {
    scroll-behavior: auto;
  }
</style>
