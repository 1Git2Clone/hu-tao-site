<script lang="ts">
  import "./layout.css";
  import "$lib/styles/font.css";
  import { ModeWatcher } from "mode-watcher";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Background from "$lib/components/layout/Background.svelte";

  import Seo from "$lib/components/layout/Seo.svelte";
  import { onNavigate } from "$app/navigation";

  let { children } = $props();

  // The browser takes a still of the old page and drops its DOM at once, so a
  // fast click never leaves a page behind. layout.css animates the two pages.
  onNavigate((navigation) => {
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigation.from?.url.pathname === navigation.to?.url.pathname
    ) {
      return;
    }

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<Seo />
<ModeWatcher synchronousModeChanges />
<Header />

<main
  id="main-content"
  class="background relative mx-auto w-full overflow-x-hidden p-(--main-padding) text-justify"
  style="min-height: calc(100dvh - var(--header-height) - var(--footer-height));"
>
  <Background />
  <!-- pt-3: the first box's prompt sits half a line above the box. The page
       transition clips to this element, so the prompt must be inside it. -->
  <div class="page pt-3">
    {@render children()}
  </div>
</main>

<Footer />

<style>
  .page {
    min-height: calc(100dvh - var(--layout-chrome));
    display: grid;
    align-items: start;
  }

  :global(html) {
    scroll-behavior: auto;
  }
</style>
