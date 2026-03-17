<script lang="ts">
	import { page } from '$app/state';
	import { slugify } from '$lib/components/blog/slugify';
	import TableOfContents from './TableOfContents.svelte';

	let { title, date, readingTime, children } = $props<{
		title: string;
		date: string;
		readingTime: string;
		children: import('svelte').Snippet;
	}>();

	const headings = $derived(page.data.headings || []);
	function headingCopy(node: HTMLElement) {
		const handleGlobalClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const heading = target.closest('h1, h2, h3, h4, h5, h6') as HTMLElement | null;

			if (heading && node.contains(heading)) {
				const id = heading.id;
				if (!id) {
					console.warn(`No heading ID for ${heading}`);
					return;
				}

				const url = new URL(window.location.href);
				url.hash = id;
				const fullLink = url.toString();

				navigator.clipboard.writeText(fullLink).then(() => {
					heading.classList.add('copied');
					setTimeout(() => heading.classList.remove('copied'), 1250);
				});
			}
		};

		node.addEventListener('click', handleGlobalClick);
		return {
			destroy: () => node.removeEventListener('click', handleGlobalClick)
		};
	}
</script>

<div class="mx-auto w-full max-w-400">
	<div class="grid grid-cols-1 xl:grid-cols-[16rem_minmax(0,52rem)_16rem] xl:gap-8">
		<div class="hidden xl:block"></div>

		<article
			id="markdown-article"
			use:headingCopy
			class="prose max-w-none min-w-0 py-12 wrap-break-word dark:prose-invert"
		>
			{#if title}
				<h1 id={slugify(title)}>{title}</h1>
			{/if}

			<div class="meta mb-4 text-sm text-slate-500">
				<span>{date}</span> • <span>{readingTime}</span>
			</div>

			<div class="not-prose mb-8 xl:hidden">
				<details class="dark:border-accent-bg-hover rounded-lg border border-primary bg-muted/40">
					<summary
						class="text-primary-900 flex cursor-pointer list-none items-center justify-between p-4 font-bold dark:text-white"
					>
						On This Page
						<span class="text-xs font-normal opacity-50">View Sections</span>
					</summary>
					<div class="border-t p-4">
						<TableOfContents isMobile={true} staticHeadings={headings} />
					</div>
				</details>
			</div>

			{@render children()}
		</article>

		<aside class="hidden xl:block">
			<div class="scrollbar-hide sticky top-20 max-h-[calc(100vh-10rem)] overflow-y-auto py-12">
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

	#markdown-article :global(:is(h1, h2, h3, h4, h5, h6)) {
		position: relative;
		cursor: pointer;
	}

	#markdown-article :global(:is(h1)) {
		padding-left: 2.75rem;
	}

	#markdown-article :global(:is(h2)) {
		padding-left: 2rem;
	}

	#markdown-article :global(:is(h3, h4, h5, h6)) {
		padding-left: 1.75rem;
	}

	#markdown-article :global(:is(h1, h2, h3, h4, h5, h6)::before) {
		content: '';
		position: absolute;
		left: 0;
		color: var(--color-accent);
		opacity: 0.5;
		transition: all 0.2s ease;
		user-select: none;
	}

	#markdown-article :global(:is(h1, h2, h3, h4, h5, h6):hover::before) {
		opacity: 1;
		/* transform: scale(1.1); */
	}

	#markdown-article :global(:is(h1, h2, h3, h4, h5, h6).copied::before) {
		content: '';
		color: var(--color-highlight);
		opacity: 1;
	}

	#markdown-article :global(:is(h1, h2, h3, h4, h5, h6).copied) {
		color: var(--color-accent);
	}
</style>
