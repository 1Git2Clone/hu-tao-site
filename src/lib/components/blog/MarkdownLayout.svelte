<script lang="ts">
	import { page } from '$app/state';
	import { slugify } from '$lib/utils/slugify';
	import HeadingCopy from '$lib/components/HeadingCopy.svelte';
	import TableOfContents from './TableOfContents.svelte';

	let { title, date, readingTime, children } = $props<{
		title: string;
		date: string;
		readingTime: string;
		children: import('svelte').Snippet;
	}>();

	const headings = $derived(page.data.headings || []);
</script>

<div class="mx-auto w-full max-w-400">
	<!--
		xl:justify-center is load-bearing. The three tracks add up to 88rem and the
		container allows 100rem, so on anything wider than 1408px there is slack —
		and a grid puts all of it after the last track by default, shoving the
		article and its sidebar left of centre while the header stays centred on
		the viewport. Centring the track block fixes it: the two side columns are
		both 16rem, so the article sits exactly in the middle of the block, and
		therefore exactly in the middle of the page.
	-->
	<div
		class="grid grid-cols-1 xl:grid-cols-[16rem_minmax(0,52rem)_16rem] xl:justify-center xl:gap-8"
	>
		<div class="hidden xl:block"></div>

		<article class="border-border box-gradient rounded-lg border p-8 text-justify">
			<HeadingCopy tag="div" class="prose max-w-none min-w-0 wrap-break-word dark:prose-invert">
				{#if title}
					<h1 id={slugify(title)}>{title}</h1>
				{/if}

				<div class="meta mb-4 text-sm text-subtextcol">
					<span>{date}</span>
					<span aria-hidden="true">•</span>
					<span>{readingTime}</span>
				</div>

				<div class="not-prose mb-8 xl:hidden">
					<details class="border-border box-gradient rounded-lg border">
						<summary
							class="flex cursor-pointer list-none items-center justify-between p-4 font-bold text-subtextcol"
						>
							On This Page
							<span class="text-xs font-normal text-subtextcol">View Sections</span>
						</summary>
						<div class="border-t p-4">
							<TableOfContents isMobile={true} staticHeadings={headings} />
						</div>
					</details>
				</div>

				{@render children()}
			</HeadingCopy>
		</article>

		<aside class="hidden xl:block">
			<div
				class="scrollbar-hide border-border box-gradient fixed max-h-[calc(100dvh-var(--layout-chrome))] w-64 overflow-y-auto rounded-lg border px-4 py-8"
			>
				<TableOfContents staticHeadings={headings} />
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
</style>
