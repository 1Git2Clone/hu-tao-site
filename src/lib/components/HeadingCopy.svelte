<script lang="ts">
  import type { Snippet } from "svelte";
  import { SvelteURL } from "svelte/reactivity";

  let {
    tag = "div",
    class: className = "",
    children,
  }: {
    tag?: "article" | "div" | "section";
    class?: string;
    children: Snippet;
  } = $props();

  function headingCopy(node: HTMLElement) {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const heading = target.closest(
        "h1, h2, h3, h4, h5, h6",
      ) as HTMLElement | null;

      if (heading && node.contains(heading)) {
        const id = heading.id;
        if (!id) {
          if (import.meta.env.DEV) console.warn(`No heading ID for ${heading}`);
          return;
        }

        const rect = heading.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const paddingLeft = parseFloat(
          window.getComputedStyle(heading).paddingLeft,
        );
        if (clickX > paddingLeft) {
          return;
        }

        const url = new SvelteURL(window.location.href);
        url.hash = id;

        navigator.clipboard.writeText(url.toString()).then(() => {
          heading.classList.add("copied");
          setTimeout(() => heading.classList.remove("copied"), 1250);
        });
      }
    };

    node.addEventListener("click", handleGlobalClick);
    return {
      destroy: () => node.removeEventListener("click", handleGlobalClick),
    };
  }
</script>

<svelte:element this={tag} use:headingCopy class="heading-copy {className}">
  {@render children()}
</svelte:element>

<style>
  .heading-copy :global(:is(h1, h2, h3, h4, h5, h6)) {
    position: relative;
    cursor: default;
  }

  .heading-copy :global(:is(h1)) {
    padding-left: 2.75rem;
  }

  .heading-copy :global(:is(h2)) {
    padding-left: 2rem;
  }

  .heading-copy :global(:is(h3, h4, h5, h6)) {
    padding-left: 1.75rem;
  }

  .heading-copy :global(:is(h1, h2, h3, h4, h5, h6)::before) {
    content: "";
    position: absolute;
    left: 0;
    color: var(--color-accent);
    opacity: 0.5;
    transition: all 0.2s ease;
    user-select: none;
    cursor: pointer;
  }

  .heading-copy :global(:is(h1, h2, h3, h4, h5, h6):hover::before) {
    opacity: 1;
  }

  .heading-copy :global(:is(h1, h2, h3, h4, h5, h6).copied::before) {
    content: "";
    color: var(--color-highlight);
    opacity: 1;
  }
</style>
