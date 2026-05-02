<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status} — 1Git2Clone</title>
</svelte:head>

<div class="prose w-full max-w-none dark:prose-invert">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<p class="text-6xl font-bold tracking-tight text-accent">{page.status}</p>
		<h1 class="mt-2 text-2xl font-bold">
			{page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="text-subtextcol">
			{page.error?.message ?? 'An unexpected error occurred.'}
		</p>

		<div class="mt-6 flex gap-6 text-sm">
			<a href={resolve('/')} class="inline-flex items-center gap-1">
				Go home <span aria-hidden="true">→</span>
			</a>
			<a href={resolve('/blog')} class="inline-flex items-center gap-1">
				Browse blog <span aria-hidden="true">→</span>
			</a>
		</div>
	</section>
</div>
