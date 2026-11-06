<script lang="ts">
  import Forgejo from "$lib/components/icons/Forgejo.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import Twitter from "$lib/components/icons/Twitter.svelte";
  import {
    GITHUB_PROFILE_NAME,
    TWITTER_PROFILE_HANDLE,
  } from "$lib/utils/consts";

  let { class: className = "" }: { class?: string } = $props();

  // Identical tiles set the rhythm, so glyphs of different widths still read as evenly
  // spaced. Tiles use the box-gradient fill with a border in the icon's own colour (legible
  // on any background in either theme), and round off a little on
  // hover without becoming circles: squircle to a softer superellipse where corner-shape
  // is supported, a larger corner radius elsewhere.
  // The tile is a span, not the <a>: the global `a { transition }` rule in layout.css is
  // unlayered, so it would override transition-all and the corners would snap.
  const tile = [
    "grid size-9 place-items-center rounded-[28%] border-2 border-current bg-white/40 backdrop-blur-[2px] transition-all duration-200 dark:bg-black/50",
    "group-hover:rounded-[40%]",
    "supports-[corner-shape:squircle]:rounded-[50%] supports-[corner-shape:squircle]:[corner-shape:squircle]",
    "supports-[corner-shape:squircle]:group-hover:[corner-shape:superellipse(1.3)]",
  ].join(" ");
  const ICON = 24;
</script>

<div class="flex items-center gap-2 {className}">
  <a href="https://git.hu-tao.dev/hutao" aria-label="Forgejo" class="group">
    <span class={tile}>
      <Forgejo width={ICON} height={ICON} />
    </span>
  </a>
  <a
    href="https://github.com/{GITHUB_PROFILE_NAME}"
    aria-label="GitHub"
    class="group"
  >
    <span class={tile}>
      <GitHub width={ICON} height={ICON} />
    </span>
  </a>
  <a
    href="https://twitter.com/{TWITTER_PROFILE_HANDLE}"
    aria-label="Twitter"
    class="group"
  >
    <span class={tile}>
      <Twitter width={ICON} height={ICON} />
    </span>
  </a>
</div>
