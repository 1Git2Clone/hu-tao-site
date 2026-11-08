<script lang="ts">
  import { resolve } from "$app/paths";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { TILE } from "./SocialLinks.svelte";

  const LINKS = [
    { href: resolve("/"), label: "/home", exact: true },
    { href: resolve("/blogs"), label: "/blogs", exact: false },
    { href: resolve("/infra"), label: "/infra", exact: true },
  ];

  let isOpen = $state(false);
  let button: HTMLButtonElement;

  function currentOf(link: (typeof LINKS)[number]) {
    const active = link.exact
      ? page.url.pathname === link.href
      : page.url.pathname.startsWith(link.href);

    return active ? ("page" as const) : undefined;
  }

  // The header outlives the page, so every navigation closes the menu: its
  // links, the title, and back or forward.
  beforeNavigate(() => {
    isOpen = false;
  });

  // Closing makes the menu inert, which would drop focus from a link inside
  // it to the page, so focus goes back to the button.
  function onkeydown(event: KeyboardEvent) {
    if (event.key !== "Escape" || !isOpen) return;
    isOpen = false;
    button.focus();
  }
</script>

<ul class="hidden gap-4 text-lg md:flex md:gap-12">
  {#each LINKS as link (link.href)}
    <li>
      <a href={link.href} aria-current={currentOf(link)}>
        {link.label}
      </a>
    </li>
  {/each}
</ul>

<svelte:window {onkeydown} />

<div class="md:hidden">
  <!-- Two lines, like "=", that turn into an X while the menu is open. -->
  <button
    bind:this={button}
    type="button"
    class="group cursor-pointer"
    aria-label="Menu"
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
  >
    <span class={TILE}>
      {#each ["-translate-y-1 group-aria-expanded:rotate-45", "translate-y-1 group-aria-expanded:-rotate-45"] as line (line)}
        <span
          class="col-start-1 row-start-1 h-0.5 w-4 bg-current transition-transform duration-200 group-aria-expanded:translate-y-0 {line}"
        ></span>
      {/each}
    </span>
  </button>

  <div
    class="absolute inset-x-0 top-full grid grid-rows-[1fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-[ease] inert:grid-rows-[0fr]"
    inert={!isOpen}
  >
    <ul
      class="background-mobile-nav flex min-h-0 flex-col overflow-hidden border-b border-accent px-8 text-lg"
    >
      {#each LINKS as link (link.href)}
        <li>
          <a
            href={link.href}
            aria-current={currentOf(link)}
            class="block py-3 text-center"
            onclick={() => (isOpen = false)}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
