<script lang="ts">
	import { page } from '$app/state';
	export let data;

	const SITE_URL = 'https://1g2c.netlify.app';
	const { title, summary } = data.metadata;
	const canonical = `${SITE_URL}${page.url.pathname}`;
	const ogTitle = `${title} — 1Git2Clone`;
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta name="description" content={summary} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={summary} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="https://1g2c.netlify.app/og-image.jpg" />
</svelte:head>

<svelte:component this={data.component} snippets={data.snippets} metadata={data.metadata} />
