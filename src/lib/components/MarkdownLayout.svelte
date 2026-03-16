<script lang="ts">
	import { slugify } from '$lib/utils/slugify';
	import TableOfContents from './TableOfContents.svelte';

	export let title: string;
	export let date: string;
	export let readingTime: string;
</script>

<div class="mx-auto w-full max-w-400">
	<div class="grid grid-cols-1 xl:grid-cols-[16rem_minmax(0,52rem)_16rem] xl:gap-12">
		<div class="hidden xl:block"></div>

		<article class="max-w-none min-w-0 py-12 wrap-break-word">
			{#if title}
				<h1 id={slugify(title)}>{title}</h1>
			{/if}

			<div class="meta mb-4 text-sm text-slate-500">
				<span>{date}</span> • <span>{readingTime}</span>
			</div>

			<div class="mb-8 xl:hidden">
				<details class="dark:border-accent-bg-hover rounded-lg border border-primary bg-muted/40">
					<summary
						class="text-primary-900 flex cursor-pointer list-none items-center justify-between p-4 font-bold dark:text-white"
					>
						On This Page
						<span class="text-xs font-normal opacity-50">View Sections</span>
					</summary>
					<div class="border-t p-4">
						<TableOfContents isMobile={true} />
					</div>
				</details>
			</div>

			<slot />
		</article>

		<aside class="hidden xl:block">
			<div class="scrollbar-hide sticky top-20 max-h-[calc(100vh-10rem)] overflow-y-auto py-12">
				<TableOfContents />
			</div>
		</aside>
	</div>
</div>

<style>
	:global(.katex-display) {
		overflow-x: auto;
		overflow-y: hidden;
		padding: 0.5rem 0;
	}

	article {
		min-width: 0; /* The magic fix for grid/flex children overflow */
		word-wrap: break-word;
	}
</style>
