<script lang="ts">
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";
  import Nav from "$lib/components/layout/Nav.svelte";
  import SocialLinks from "$lib/components/layout/SocialLinks.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import { SITE_TITLE } from "$lib/utils/consts";

  function handleLogoClick(e: MouseEvent) {
    if (e.clientX !== 0 || e.clientY !== 0) {
      e.preventDefault();
      goto(resolve("/"));
    }
  }
</script>

<header
  class="background sticky top-0 z-1 grid h-(--header-height) grid-cols-[1fr_auto_1fr] items-center border-b px-8"
>
  <a
    href="#main-content"
    class="group relative w-fit text-lg font-bold whitespace-nowrap"
    aria-label="Skip to main content"
    onclick={handleLogoClick}
  >
    <span
      class="hidden transition-opacity duration-150 ease-in-out group-focus-visible:opacity-0 sm:inline"
      >{SITE_TITLE}</span
    >
    <span
      class="pointer-events-none absolute inset-0 flex items-center opacity-0 transition-opacity duration-150 ease-in-out group-focus-visible:opacity-100"
      >Skip to content</span
    >
  </a>

  <nav class="flex justify-center">
    <Nav />
  </nav>

  <div class="flex items-center justify-end gap-4">
    <SocialLinks class="hidden sm:flex" />

    <div class="hidden sm:inline-flex" aria-hidden={true}></div>

    <ThemeToggle />
  </div>
</header>
