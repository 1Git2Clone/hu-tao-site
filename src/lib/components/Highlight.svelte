<script lang="ts">
  import type { FuseResultMatch } from "fuse.js";

  let { text, matches, path } = $props<{
    text: string;
    matches: readonly FuseResultMatch[] | undefined;
    path: string;
  }>();

  const match = $derived(matches?.find((m: FuseResultMatch) => m.key === path));

  const parts = $derived.by(() => {
    if (!match) return [{ text, highlight: false }];

    const result = [];
    let lastIndex = 0;
    // Sort indices just in case
    const sortedIndices = [...match.indices].sort((a, b) => a[0] - b[0]);

    for (const [start, end] of sortedIndices) {
      // Text before match
      if (start > lastIndex) {
        result.push({ text: text.slice(lastIndex, start), highlight: false });
      }
      // The match itself (Fuse indices are inclusive)
      result.push({ text: text.slice(start, end + 1), highlight: true });
      lastIndex = end + 1;
    }

    // Remaining text
    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex), highlight: false });
    }
    return result;
  });
</script>

{#each parts as part, i (part.text + i)}
  {#if part.highlight}
    <span class="font-bold text-highlight">{part.text}</span>
  {:else}
    {part.text}
  {/if}
{/each}
