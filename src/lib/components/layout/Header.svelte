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

<!-- Below md: theme button on the left, title in the middle, menu on the
     right. From md: title on the left, links in the middle, socials and the
     theme button on the right. All items sit on row 1 of one grid. -->
<header
  class="background sticky top-0 z-1 grid h-(--header-height) grid-cols-[1fr_auto_1fr] items-center border-b border-accent px-8"
>
  <a
    href="#main-content"
    class="group relative col-start-2 row-start-1 w-fit justify-self-center text-lg font-bold whitespace-nowrap md:col-start-1 md:justify-self-start"
    aria-label="Skip to main content"
    onclick={handleLogoClick}
  >
    <span
      class="transition-opacity duration-150 ease-in-out group-focus-visible:opacity-0"
      >{SITE_TITLE}</span
    >
    <span
      class="pointer-events-none absolute inset-0 flex items-center opacity-0 transition-opacity duration-150 ease-in-out group-focus-visible:opacity-100"
      >Skip to content</span
    >
  </a>

  <nav
    class="col-start-3 row-start-1 flex justify-self-end md:col-start-2 md:justify-self-center"
  >
    <Nav />
  </nav>

  <div
    class="col-start-1 row-start-1 flex items-center gap-4 justify-self-start md:col-start-3 md:justify-self-end"
  >
    <SocialLinks class="hidden md:flex" />

    <div class="hidden md:inline-flex" aria-hidden={true}></div>
    <ThemeToggle />
  </div>
</header>
