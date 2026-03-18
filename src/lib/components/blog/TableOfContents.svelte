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

	onMount(() => {
		const elements = Array.from(document.querySelectorAll('article h2, article h3'));

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) activeId = entry.target.id;
				});
			},
			{ rootMargin: '-20% 0% -35% 0%' }
		);

		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
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
