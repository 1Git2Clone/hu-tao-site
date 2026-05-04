<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';

	interface Props {
		currentPage: number;
		totalItems: number;
		itemsPerPage: number;
		query?: string;
	}

	let { currentPage, totalItems, itemsPerPage, query = '' }: Props = $props();

	const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
	const hasNextPage = $derived(currentPage < totalPages);
	const hasPrevPage = $derived(currentPage > 1);

	function getPageUrl(page: number): string {
		const searchParams = new SvelteURLSearchParams();
		searchParams.set('page', page.toString());
		if (query) {
			searchParams.set('q', query);
		}
		return `${resolve('/blogs')}?${searchParams.toString()}`;
	}

	function handlePageChange(page: number) {
		goto(getPageUrl(page), { noScroll: true });
	}
</script>

{#if totalPages > 1}
	<nav class="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
		<button
			onclick={() => handlePageChange(currentPage - 1)}
			disabled={!hasPrevPage}
			class="inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-50"
			class:pointer-events-none={!hasPrevPage}
		>
			<span aria-hidden="true">←</span>
			Previous
		</button>

		<span class="text-muted-foreground text-sm">
			Page {currentPage} of {totalPages}
		</span>

		<button
			onclick={() => handlePageChange(currentPage + 1)}
			disabled={!hasNextPage}
			class="inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-50"
			class:pointer-events-none={!hasNextPage}
		>
			Next
			<span aria-hidden="true">→</span>
		</button>
	</nav>
{/if}
