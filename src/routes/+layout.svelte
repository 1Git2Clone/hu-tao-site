<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '$lib/styles/font.css';
	let { children } = $props();
</script>

<ModeWatcher />

<Header />

<main class="bg-primary mx-auto h-screen w-screen max-w-4xl p-6">
	{@render children()}
</main>

<Footer />
