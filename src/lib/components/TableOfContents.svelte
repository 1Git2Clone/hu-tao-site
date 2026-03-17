<script lang="ts">
	import { onMount } from 'svelte';

	export let isMobile = false;

	let headings: { id: string; html: string; level: number }[] = [];
	let activeId = '';

	onMount(() => {
		const elements = Array.from(document.querySelectorAll('article h2, article h3'));

		headings = elements.map((el) => {
			const clone = el.cloneNode(true) as HTMLElement;

			clone.querySelectorAll('.katex-mathml, .katex-accessible-sr').forEach((n) => n.remove());

			return {
				id: el.id,
				html: clone.innerHTML.trim(),
				level: parseInt(el.nodeName[1])
			};
		});

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

<nav class={isMobile ? 'w-full' : 'w-64 shrink-0'}>
	<div>
		{#if !isMobile}
			<b class="mb-4 block text-sm font-bold tracking-widest text-textcol uppercase">
				On This Page
			</b>
		{/if}

		<ul class="space-y-3 {isMobile ? '' : 'border-l border-slate-200'}">
			{#each headings as { id, html, level }}
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
