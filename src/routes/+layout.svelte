<script lang="ts">
	import './layout.css';
	import '$lib/styles/katex.css';
	import '$lib/styles/font.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

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
	class="background relative mx-auto w-full overflow-x-hidden p-[var(--main-padding)]"
	style="min-height: calc(100dvh - var(--header-height) - var(--footer-height));"
>
	<div class="grid-stack">
		{@render children()}
	</div>
</main>

<Footer />

<style>
	.grid-stack {
		min-height: calc(100dvh - var(--layout-chrome));
		display: grid;
		grid-template-areas: 'stack';
		align-items: start;
	}

	.grid-stack > :global(*) {
		grid-area: stack;
		backface-visibility: hidden;
	}

	:global(html) {
		scroll-behavior: auto;
	}
</style>
