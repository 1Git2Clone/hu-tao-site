<script lang="ts">
	import { type History } from '$lib/types/history-tree';
	import { SvelteURL } from 'svelte/reactivity';
	import snarkdown from 'snarkdown';

	let { history, baseHeadingLevel = 2 }: { history: History[]; baseHeadingLevel?: number } =
		$props();
	let copiedId = $state('');

	const yearTag = $derived(`h${baseHeadingLevel}`);
	const monthTag = $derived(`h${baseHeadingLevel + 1}`);

	const handleClick = (id: string) => {
		const url = new SvelteURL(window.location.href);
		url.hash = id;

		navigator.clipboard.writeText(url.toString()).then(() => {
			copiedId = id;
			setTimeout(() => {
				if (copiedId) copiedId = '';
			}, 1250);
		});
	};
</script>

<div class="relative ml-4 space-y-8 border-l-2 border-accent pl-6">
	{#each history as { year, months }, i (year + '-' + i)}
		<section>
			<div
				class="border-background absolute -left-2.25 size-4 rounded-full border-4 bg-accent-hover"
			></div>

			<button
				type="button"
				class="block w-full text-left"
				onclick={() => handleClick(year.toString())}
			>
				<svelte:element
					this={yearTag}
					id={year.toString()}
					class="mt-0 mb-4 text-2xl font-bold text-primary"
					class:copied={copiedId === year.toString()}
				>
					{year}
				</svelte:element>
			</button>

			<div class="space-y-6">
				{#each months as month, i (month + '-' + i)}
					{@const monthId = year + '-' + month.name.replace(/\s+/g, '-').toLowerCase()}
					<div class="relative">
						<button
							type="button"
							class="block w-full text-left"
							onclick={() => handleClick(monthId)}
						>
							<svelte:element
								this={monthTag}
								id={monthId}
								class="text-muted-foreground mt-0 text-lg font-semibold"
								class:copied={copiedId === monthId}
							>
								{month.name}
							</svelte:element>
						</button>

						<div
							class="prose mt-2 max-w-none space-y-4 border-l border-accent/60 pl-4 dark:prose-invert [&_blockquote]:mt-0 [&_li]:mt-0 [&_ol]:mt-0 [&_p]:mt-0 [&_ul]:mt-0"
						>
							{#each month.tasks as task, i (task + i)}
								{@html snarkdown(task)}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
