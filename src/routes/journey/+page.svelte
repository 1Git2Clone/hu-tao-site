<script lang="ts">
	import HistoryTree from '$lib/components/root/HistoryTree.svelte';
	import { LINUX_AND_DOTFILES_HISTORY_TREE } from '$lib/content/root/linux-and-dotfiles-history-tree';
</script>

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 id="title" class="text-4xl font-bold tracking-tight">Linux Journey</h1>

		<p>My journey into the Linux world — from first install to current setup.</p>

		<HistoryTree history={LINUX_AND_DOTFILES_HISTORY_TREE} baseHeadingLevel={2} />
	</section>
</div>
