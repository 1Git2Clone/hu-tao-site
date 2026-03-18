<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<nav class="flex gap-4 text-lg sm:gap-12">
	<a href={resolve('/')} class="hidden sm:block">Home</a>
	<a href={resolve('/blog')}>Blog</a>
	<a href={resolve('/about-me')}>About Me</a>
</nav>
