<script lang="ts">
  import "./layout.css";
  import "$lib/styles/font.css";
  import { ModeWatcher } from "mode-watcher";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Background from "$lib/components/layout/Background.svelte";

  import Seo from "$lib/components/layout/Seo.svelte";
  import { onNavigate } from "$app/navigation";
  import type { OnNavigate } from "@sveltejs/kit";

  let { children } = $props();

  // The newest navigation that reached onNavigate, which Kit calls only just
  // before it commits a page. Set before the early returns below: a same-page
  // or reduced-motion navigation can also overtake one that is waiting here.
  let latest: OnNavigate | undefined;

  // The browser takes a still of the old page and drops its DOM at once, so a
  // fast click never leaves a page behind. layout.css animates the two pages.
  onNavigate((navigation) => {
    latest = navigation;
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigation.from?.url.pathname === navigation.to?.url.pathname
    ) {
      return;
    }

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        // Kit awaits the returned promise, then commits the page without
        // checking its navigation token again; that check comes only after
        // the DOM has changed. A Back press in the frame before this callback
        // can finish a newer navigation first, and resolving would then put
        // this page back over it. So an overtaken navigation is left
        // unsettled on purpose: Kit never resumes it, and it never commits.
        // ponytail: one suspended navigation per overtaken page change;
        // remove the guard once Kit re-checks its token after onNavigate.
        if (latest !== navigation) return;
        resolve();
        // An aborted navigation rejects this; the snapshot only needs it to
        // end, and an unhandled rejection would surface as a page error.
        await navigation.complete.catch(() => {});
      });
      // A later navigation can skip this snapshot while keeping its update.
      void transition.ready.catch(() => {});
    });
  });
</script>

<Seo />
<ModeWatcher synchronousModeChanges />
<Header />

<main
  id="main-content"
  class="background relative mx-auto w-full overflow-x-hidden p-(--main-padding)"
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
