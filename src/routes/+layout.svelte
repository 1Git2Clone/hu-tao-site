<script lang="ts">
	import './layout.css';
	import '$lib/styles/katex.css';
	import '$lib/styles/font.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { SITE_TITLE } from '$lib/utils/consts';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.title = SITE_TITLE;
	});
</script>

<ModeWatcher />
<Header />

<main
	id="main-content"
	class="relative mx-auto w-full overflow-x-hidden bg-primary p-6"
	style="min-height: calc(100vh - 6rem - 4rem);"
>
	{#key page.url.pathname}
		<div
			class="grid-stack"
			in:fly={{ y: 12, duration: 200, delay: 200, opacity: 0 }}
			out:fade={{ duration: 200 }}
		>
			{@render children()}
		</div>
	{/key}
</main>

<Footer />

<style>
	.grid-stack {
		display: grid;
		grid-template-areas: 'stack';
		align-items: start;
	}

	.grid-stack > :global(*) {
		grid-area: stack;
		backface-visibility: hidden;
	}

	:global(html) {
		scroll-behavior: smooth;
	}
</style>
