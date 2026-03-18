<script>
	import { resolve } from '$app/paths';
	import Nav from '$lib/components/layout/Nav.svelte';
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	import {
		GITHUB_PROFILE_NAME,
		SITE_TITLE,
		SITE_TITLE_SHORT,
		TWITTER_PROFILE_HANDLE
	} from '$lib/utils/consts';
</script>

<header class="background sticky top-0 z-1 h-16 border-b">
	<div class="mx-auto flex items-center justify-between px-6 py-3">
		<a href={resolve('/')} class="text-lg font-bold">
			<span class="sm:hidden">{SITE_TITLE_SHORT}</span>
			<span class="hidden sm:inline">{SITE_TITLE}</span>
		</a>

		<div class="absolute left-1/2 -translate-x-1/2 transform">
			<Nav />
		</div>

		<div class="flex items-center gap-4">
			<a
				href={`https://github.com/${GITHUB_PROFILE_NAME}`}
				aria-label="GitHub"
				class="hidden sm:inline-flex"
			>
				<GitHub />
			</a>

			<a
				href={`https://twitter.com/${TWITTER_PROFILE_HANDLE}`}
				aria-label="Twitter"
				class="hidden sm:inline-flex"
			>
				<Twitter />
			</a>

			<div></div>

			<ThemeToggle />
		</div>
	</div>
</header>
