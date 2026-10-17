<script lang="ts">
	import { page } from '$app/state';
	export let data;

	import { SITE_URL } from '$lib/utils/consts';
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
	<meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
</svelte:head>

<svelte:component this={data.component} snippets={data.snippets} metadata={data.metadata} />
