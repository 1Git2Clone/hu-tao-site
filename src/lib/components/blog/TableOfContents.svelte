<script lang="ts">
	// Reason: Re-rendering already rendered content.
	/* eslint-disable svelte/no-at-html-tags */
	import { onMount } from 'svelte';

	type Heading = { id: string; html: string; level: number };

	let { staticHeadings = [], isMobile = false } = $props<{
		staticHeadings: Heading[];
		isMobile?: boolean;
	}>();

	let activeId = $state('');

	let headingPositions: { id: string; top: number }[] = [];
	let cachedInnerHeight: number = 0;

	const computeHeadingPositions = () => {
		const headings = Array.from(
			document.querySelectorAll('article h2, article h3')
		) as HTMLElement[];
		headingPositions = headings.map((el) => ({ id: el.id, top: el.offsetTop }));
		cachedInnerHeight = window.innerHeight;
	};

	onMount(() => {
		computeHeadingPositions();

		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					const scroll = window.scrollY + cachedInnerHeight * 0.2;
					for (let i = headingPositions.length - 1; i >= 0; i--) {
						if (scroll >= headingPositions[i].top) {
							if (activeId !== headingPositions[i].id) activeId = headingPositions[i].id;
							break;
						}
					}
					ticking = false;
				});
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', computeHeadingPositions);
		onScroll();

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', computeHeadingPositions);
		};
	});
</script>

<nav class={`${isMobile ? 'w-full' : 'w-64 shrink-0'} contrast-70`}>
	<div>
		{#if !isMobile}
			<b class="mb-4 block text-sm font-bold tracking-widest text-textcol uppercase">
				On This Page
			</b>
		{/if}

		<ul class="space-y-3 {isMobile ? '' : 'border-l border-slate-200'}">
			{#each staticHeadings as { id, html, level } (id)}
				<li>
					<a
						href="#{id}"
						class="block text-sm transition-colors duration-200
                          {isMobile ? '' : '-ml-px border-l pl-4'}
                          {level === 3 ? (isMobile ? 'pl-4 italic' : 'ml-4') : ''}
                          {activeId === id
							? 'border-accent-hover font-medium text-accent'
							: 'border-transparent text-accent-bg hover:text-accent-hover'}"
					>
						{@html html}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
