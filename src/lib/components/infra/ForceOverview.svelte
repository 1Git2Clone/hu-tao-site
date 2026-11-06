<script lang="ts">
  import ForceGraph from "./ForceGraph.svelte";
  import type { Layout } from "$lib/data/graph-geometry";
  import type { Graph, OverviewNode } from "$lib/types/infra-graph";

  let {
    graph,
    wide,
    tall,
  }: { graph: Graph<OverviewNode>; wide: Layout; tall: Layout } = $props();

  let selectedId = $state<string>();
</script>

<svelte:window
  onkeydown={(event) => event.key === "Escape" && (selectedId = undefined)}
/>

<!-- Both are laid out on the server and switched by CSS, so nothing moves on hydration. -->
<ForceGraph {graph} layout={wide} bind:selectedId class="hidden lg:block" />
<ForceGraph
  {graph}
  layout={tall}
  bind:selectedId
  class="mx-auto max-w-sm lg:hidden"
/>
