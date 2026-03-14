<script>
	import Nav from '$lib/components/Nav.svelte';
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	import { GITHUB_PROFILE_NAME, TWITTER_PROFILE_HANDLE } from '$lib/utils/consts';
</script>

<header class="border-b">
	<div class="mx-auto flex max-w-4xl items-center justify-between p-4">
		<a href="/" class="text-lg font-bold">1k2s</a>

		<Nav />

		<div class="flex items-center gap-4">
			<a href={`https://github.com/${GITHUB_PROFILE_NAME}`} aria-label="GitHub">
				<GitHub />
			</a>

			<a href={`https://twitter.com/${TWITTER_PROFILE_HANDLE}`} aria-label="Twitter">
				<Twitter />
			</a>

			<ThemeToggle />
		</div>
	</div>
</header>
