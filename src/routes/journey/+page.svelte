<script lang="ts">
  import HistoryTree from "$lib/components/journey/HistoryTree.svelte";
  import Term from "$lib/components/layout/Term.svelte";
  import { LINUX_AND_DOTFILES_HISTORY_TREE } from "$lib/content/root/linux-and-dotfiles-history-tree";
</script>

<Term
  label="Linux Journey"
  level={1}
  id="title"
  path="~"
  cmd="history"
  cursor
  hero
  class="mx-auto w-full max-w-4xl"
  bodyClass="prose min-w-full px-4 pt-4 pb-6 sm:px-8"
>
  <p class="mt-0">
    My journey into the Linux world — from first install to current setup.
  </p>

  <HistoryTree history={LINUX_AND_DOTFILES_HISTORY_TREE} baseHeadingLevel={2} />
</Term>
