<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const LINKS = [
		{ href: resolve('/'), label: 'Home', exact: true },
		{ href: resolve('/blogs'), label: 'Blogs', exact: false },
		{ href: resolve('/about-me'), label: 'About Me', exact: true },
		{ href: resolve('/infra'), label: 'Infra', exact: true }
	];

	let menu: HTMLDetailsElement | undefined = $state();

	function currentOf(link: (typeof LINKS)[number]) {
		const active = link.exact
			? page.url.pathname === link.href
			: page.url.pathname.startsWith(link.href);
		return active ? ('page' as const) : undefined;
	}

	function close() {
		if (menu) menu.open = false;
	}
</script>

<ul class="hidden gap-4 text-lg md:flex md:gap-12">
	{#each LINKS as link (link.href)}
		<li><a href={link.href} aria-current={currentOf(link)}>{link.label}</a></li>
	{/each}
</ul>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

<details bind:this={menu} class="md:hidden">
	<summary
		class="cursor-pointer list-none text-2xl [&::-webkit-details-marker]:hidden"
		aria-label="Menu"
	>
		☰
	</summary>
	<ul class="background absolute inset-x-0 top-full flex flex-col border-b px-8 py-2 text-lg">
		{#each LINKS as link (link.href)}
			<li>
				<a href={link.href} aria-current={currentOf(link)} class="block py-2" onclick={close}>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</details>
