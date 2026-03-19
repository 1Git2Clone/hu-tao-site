<script lang="ts">
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import { CURRENT_YEAR, GITHUB_PROFILE_NAME, TWITTER_PROFILE_HANDLE } from '$lib/utils/consts';
</script>

<footer class="background flex h-24 flex-col border-t">
	<div class="mx-auto max-w-4xl pt-4 text-center text-sm opacity-70">
		© {CURRENT_YEAR} Ivan, All rights reserved.
	</div>
	<div class="mx-auto max-w-4xl pt-2 text-center text-sm opacity-70">
		<a href={`https://github.com/${GITHUB_PROFILE_NAME}`} aria-label="GitHub" class="inline-flex">
			<GitHub />
		</a>

		<a
			href={`https://twitter.com/${TWITTER_PROFILE_HANDLE}`}
			aria-label="Twitter"
			class="inline-flex"
		>
			<Twitter />
		</a>
	</div>
</footer>
