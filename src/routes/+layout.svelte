<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '$lib/styles/font.css';

	let { children } = $props();
</script>

<ModeWatcher />
<Header />

<main
	class="mx-auto w-screen max-w-4xl bg-primary p-6"
	style="min-height: calc(100vh - 6rem - 4rem); /* screen - footer - header */"
>
	{@render children()}
</main>

<Footer />
