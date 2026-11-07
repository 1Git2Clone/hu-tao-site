<script lang="ts" module>
  import type { Component } from "svelte";
  import type { NerdIconName } from "$lib/components/icons/nerd-icons";

  // A Nerd Font icon name, or an icon component such as GitHub.svelte.
  export type LinkIcon =
    | NerdIconName
    | Component<{ width?: number | string; height?: number | string }>;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import NerdIcon from "$lib/components/icons/NerdIcon.svelte";

  // A link drawn as a box: | icon | label |. A link with no icon of its own
  // gets a star, so every box in a row has the same shape.
  // The box is a span, not the <a>: the unlayered `#main-content a` rules in
  // layout.css would override its border and transition. The inline style
  // turns off their hover underline, as on the skill chips.
  let {
    href,
    icon = "oct-star",
    children,
    ...rest
  }: HTMLAnchorAttributes & {
    href: string;
    icon?: LinkIcon;
    children: Snippet;
  } = $props();

  const external = $derived(href.startsWith("http"));
</script>

<a
  {...rest}
  {href}
  class="group inline-block"
  style="border: 0;"
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
>
  <span
    class="flex items-stretch border border-frame bg-white/90 text-sm text-accent transition-colors duration-200 group-hover:border-accent group-hover:text-accent-hover dark:bg-black/85"
  >
    <span
      class="grid aspect-square place-items-center border-r border-inherit p-1.5 transition-colors duration-200"
      aria-hidden="true"
    >
      {#if typeof icon === "string"}
        <NerdIcon name={icon} width={20} height={20} />
      {:else}
        {@const Icon = icon}
        <Icon width={20} height={20} />
      {/if}
    </span>
    <span class="px-3 py-1.5">{@render children()}</span>
  </span>
</a>
