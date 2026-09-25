<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const LINKS = [
		{ href: resolve('/'), label: 'Home', exact: true },
		{ href: resolve('/blogs'), label: 'Blogs', exact: false },
		{ href: resolve('/infra'), label: 'Infra', exact: true }
	];

	let isOpen = $state(false);

	function currentOf(link: (typeof LINKS)[number]) {
		const active = link.exact
			? page.url.pathname === link.href
			: page.url.pathname.startsWith(link.href);

		return active ? ('page' as const) : undefined;
	}

	function close() {
		isOpen = false;
	}
</script>

<ul class="hidden gap-4 text-lg md:flex md:gap-12">
	{#each LINKS as link (link.href)}
		<li>
			<a href={link.href} aria-current={currentOf(link)}>
				{link.label}
			</a>
		</li>
	{/each}
</ul>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

<div class="md:hidden">
	<button
		type="button"
		class="cursor-pointer text-2xl text-accent hover:accent-accent-bg"
		aria-label="Menu"
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
	>
		☰
	</button>

	<div
		class="absolute inset-x-0 top-full grid grid-rows-[1fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-[ease] aria-hidden:grid-rows-[0fr]"
		aria-hidden={!isOpen}
	>
		<ul class="background-mobile-nav flex min-h-0 flex-col overflow-hidden border-b px-8 text-lg">
			{#each LINKS as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={currentOf(link)}
						class="block py-3 text-center"
						onclick={close}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
