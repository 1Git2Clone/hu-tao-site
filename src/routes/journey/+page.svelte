<script lang="ts">
	import HistoryTree from '$lib/components/journey/HistoryTree.svelte';
	import Box from '$lib/components/layout/Box.svelte';
	import { LINUX_AND_DOTFILES_HISTORY_TREE } from '$lib/content/root/linux-and-dotfiles-history-tree';
</script>

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<Box>
		<h1 id="title" class="mt-0 text-4xl font-bold tracking-tight">Linux Journey</h1>

		<p>My journey into the Linux world — from first install to current setup.</p>

		<HistoryTree history={LINUX_AND_DOTFILES_HISTORY_TREE} baseHeadingLevel={2} />
	</Box>
</div>
