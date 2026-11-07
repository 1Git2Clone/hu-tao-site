<script lang="ts">
  import type { Snippet } from "svelte";
  import { SvelteURL } from "svelte/reactivity";

  // A box drawn like a terminal pane: the prompt sits on the top border, which
  // runs behind it. With a label the prompt is the section's heading: screen
  // readers and search engines get the label, and the prompt is decoration.
  let {
    path = "",
    cmd,
    label,
    id,
    level = 2,
    tag = "section",
    cursor = false,
    hero = false,
    class: className = "",
    bodyClass = "px-4 pt-4 pb-6 sm:px-8",
    children,
  }: {
    path?: string;
    cmd: string;
    label?: string;
    id?: string;
    level?: 1 | 2;
    tag?: "section" | "article" | "div";
    cursor?: boolean;
    hero?: boolean;
    class?: string;
    bodyClass?: string;
    children: Snippet;
  } = $props();

  // Nerd Font glyphs, by their cheat sheet names.
  const LINK_ICON = "\uf44c"; // nf-oct-link
  const CHECK_ICON = "\uf42e"; // nf-oct-check

  let copied = $state(false);

  function copy() {
    const url = new SvelteURL(window.location.href);
    url.hash = id ?? "";
    navigator.clipboard.writeText(url.toString()).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 1250);
    });
  }
</script>

<svelte:element
  this={tag}
  class={[
    "box-gradient flex flex-col border-x border-b",
    hero && "hero",
    className,
  ]}
>
  <!-- The heading is one line high and starts half a line above the box, so
       the two border pieces beside it meet the side borders. The box is a flex
       column, so that the negative margin does not collapse into it. -->
  <svelte:element
    this={label ? `h${level}` : "div"}
    {id}
    class="-mx-px -mt-3 flex border-inherit text-base leading-6 font-normal whitespace-nowrap"
  >
    <span class="h-3 w-3 shrink-0 border-b border-inherit"></span>
    <!-- One line: a long path (a blog slug on a phone) is cut short, never
         the command. The prompt has its own bordered tag, with the box's fill.
         -my-px keeps the tag centred on the border line. -->
    <span
      class="-my-px flex min-w-0 items-center gap-[1ch] border border-inherit bg-surface px-2"
    >
      {#if label}<span class="sr-only">{label}</span>{/if}
      <span
        aria-hidden={label ? true : undefined}
        class="flex min-w-0 gap-[1ch]"
      >
        {#if path}<span class="truncate text-tertiary">{path}</span>{/if}
        <span class="text-accent">$</span>
        <span class="font-bold text-subtextcol">{cmd}</span>
      </span>
      {#if cursor}
        <span
          class="h-[1.1em] w-[0.6em] shrink-0 animate-blink bg-accent motion-reduce:animate-none"
          aria-hidden="true"
        ></span>
      {/if}
      {#if label && id}
        <button
          type="button"
          class="mr-1 opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          aria-label="Copy a link to {label}"
          onclick={copy}
        >
          <span aria-hidden="true">{copied ? CHECK_ICON : LINK_ICON}</span>
        </button>
      {/if}
    </span>
    <span class="h-3 min-w-3 flex-1 border-b border-inherit"></span>
  </svelte:element>

  <div class={bodyClass}>
    {@render children()}
  </div>
</svelte:element>
