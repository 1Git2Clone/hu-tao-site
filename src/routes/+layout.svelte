<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { SITE_TITLE } from '$lib/utils/consts';
	import { onMount } from 'svelte';
	import type { RouteId } from './$types';

	let { children } = $props();

	onMount(() => {
		document.title = SITE_TITLE;

		async function handleClick(e: MouseEvent) {
			const link = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;

			if (
				!link ||
				link.origin !== location.origin ||
				link.target ||
				link.hash ||
				link.hasAttribute('download') ||
				e.metaKey ||
				e.ctrlKey ||
				e.shiftKey ||
				e.altKey
			)
				return;

			e.preventDefault();
			e.stopImmediatePropagation();

			const url = (link.pathname + link.search) as RouteId;

			window.scrollTo({ top: 0, behavior: 'smooth' });

			await new Promise<void>((res) => {
				function check() {
					if (window.scrollY === 0) res();
					else requestAnimationFrame(check);
				}
				check();
			});

			goto(resolve(url));
		}

		window.addEventListener('click', handleClick, { capture: true });

		return () => {
			window.removeEventListener('click', handleClick, { capture: true });
		};
	});
</script>

<ModeWatcher />
<Header />

<main
	class="relative mx-auto w-screen bg-gray-200 p-6 dark:bg-black/70"
	style="min-height: calc(100vh - 6rem - 4rem);"
>
	{#key page.url.pathname}
		<div class="grid-stack" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
			{@render children()}
		</div>
	{/key}
</main>

<Footer />

<style>
	.grid-stack {
		display: grid;
		grid-template-areas: 'stack';
	}

	.grid-stack > :global(*) {
		grid-area: stack;
	}
</style>
