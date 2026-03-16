<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '$lib/styles/font.css';

	import { fade } from 'svelte/transition';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<ModeWatcher />
<Header />

<main
	class="background relative mx-auto w-screen p-6"
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
