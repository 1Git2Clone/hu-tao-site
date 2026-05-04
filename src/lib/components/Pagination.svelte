<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

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
</script>

{#if totalPages > 1}
	<nav class="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
		<a
			href={getPageUrl(currentPage - 1)}
			aria-disabled={!hasPrevPage}
			class="inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-50"
			class:pointer-events-none={!hasPrevPage}
			class:opacity-50={!hasPrevPage}
		>
			<span aria-hidden="true">←</span>
			Previous
		</a>

		<span class="text-sm text-muted-foreground">
			Page {currentPage} of {totalPages}
		</span>

		<a
			href={getPageUrl(currentPage + 1)}
			aria-disabled={!hasNextPage}
			class="inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-50"
			class:pointer-events-none={!hasNextPage}
			class:opacity-50={!hasNextPage}
		>
			Next
			<span aria-hidden="true">→</span>
		</a>
	</nav>
{/if}
