<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { SITE_TITLE } from '$lib/utils/consts';
	import { onMount } from 'svelte';

	onMount(() => {
		document.title = SITE_TITLE;
	});

	let { children } = $props();
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
