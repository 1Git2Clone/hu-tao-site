<script lang="ts">
	import { resolve } from '$app/paths';
	import Nav from '$lib/components/layout/Nav.svelte';
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { GITHUB_PROFILE_NAME, SITE_TITLE, TWITTER_PROFILE_HANDLE } from '$lib/utils/consts';
</script>

<header
	class="background sticky top-0 z-1 grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b px-8"
>
	<a href={resolve('/')} class="text-lg font-bold whitespace-nowrap">
		<span class="hidden sm:inline">{SITE_TITLE}</span>
	</a>

	<nav class="flex justify-center">
		<Nav />
	</nav>

	<div class="flex items-center justify-end gap-4">
		<a
			href="https://github.com/{GITHUB_PROFILE_NAME}"
			class="hidden sm:inline-flex"
			aria-label="GitHub"
		>
			<GitHub />
		</a>
		<a
			href="https://twitter.com/{TWITTER_PROFILE_HANDLE}"
			class="hidden sm:inline-flex"
			aria-label="Twitter"
		>
			<Twitter />
		</a>

		<div class="hidden sm:inline-flex" aria-hidden={true}></div>

		<ThemeToggle />
	</div>
</header>
