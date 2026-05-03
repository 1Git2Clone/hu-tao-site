<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<nav class="flex gap-4 text-lg sm:gap-12">
	<a href={resolve('/')} aria-current={page.url.pathname === resolve('/') ? 'page' : undefined}
		>Home</a
	>
	<a
		href={resolve('/blogs')}
		aria-current={page.url.pathname.startsWith(resolve('/blogs')) ? 'page' : undefined}>Blogs</a
	>
	<a
		href={resolve('/about-me')}
		aria-current={page.url.pathname === resolve('/about-me') ? 'page' : undefined}>About Me</a
	>
</nav>
