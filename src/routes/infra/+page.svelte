<script lang="ts">
	// Reason: Supposed to be external urls
	/* eslint-disable svelte/no-navigation-without-resolve */

	// Reason: Content is written by me.
	/* eslint-disable svelte/no-at-html-tags */

	import { marked } from 'marked';
	import { SvelteURL } from 'svelte/reactivity';

	import Card from '$lib/components/layout/Card.svelte';
	import HeadingCopy from '$lib/components/HeadingCopy.svelte';
	import { INFRA_STACK, PRIVATE_SERVICES, PUBLIC_SERVICES } from '$lib/content/infra/services';
	import { SITE_URL } from '$lib/utils/consts';

	const title = 'Infrastructure — 1Git2Clone';
	const description =
		'A self-hosted VPS described entirely in one NixOS flake: git hosting, CI, status, search, observability, and backups.';
	const canonical = `${SITE_URL}/infra`;

	const SOURCE_URL = 'https://git.hu-tao.dev/hutao/vps';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
</svelte:head>

<div class="space-y-8">
	<section
		class="border-border box-gradient hero prose min-w-full rounded-lg border p-8 dark:prose-invert"
	>
		<h1 id="title" class="mt-0 text-4xl font-bold tracking-tight">Infrastructure</h1>
		<p class="text-lg text-subtextcol">
			One VPS, described end to end in a single NixOS flake — disks, firewall, secrets, and every
			container service.
		</p>
		<p>
			There is no state on the server that the repository does not describe, and nothing to remember
			to run. Where the setup it replaced needed three layers — a restart policy, a boot-time sweep,
			and a converge run from my workstation — this is one: systemd units built from the flake.
			OpenTofu creates the machine and publishes its DNS.
		</p>
		<p class="mb-0">
			<a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
				Read the flake <span aria-hidden="true">→</span>
			</a>
		</p>
	</section>

	<section class="border-border box-gradient rounded-lg border p-4">
		<ul class="flex flex-wrap justify-center gap-2">
			{#each INFRA_STACK as tech (tech.name)}
				<li class="border-border card inline-block rounded border px-2 py-1 text-sm">
					<a href={tech.url} target="_blank" rel="noopener noreferrer" style="border: 0;">
						{tech.name}
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section
		id="public"
		class="border-border box-gradient scroll-mt-[var(--scroll-offset)] rounded-lg border p-8"
	>
		<HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
			<h2 id="public-heading" class="mt-0">Public</h2>
			<p class="mb-0">Reachable from anywhere, behind one reverse proxy and one certificate.</p>
		</HeadingCopy>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each PUBLIC_SERVICES as service (service.name)}
				<Card>
					<div class="prose dark:prose-invert">
						<h3 class="mt-0 text-xl font-semibold">
							{#if service.page}
								<a href={service.page} target="_blank" rel="noopener noreferrer">{service.name}</a>
								<p class="mt-1 mb-0 font-mono text-sm break-all text-subtextcol">
									{service.displayPage || new SvelteURL(service.page).hostname}
								</p>
							{:else}
								{service.name}
							{/if}
						</h3>
						<div class="mt-3">{@html marked(service.description)}</div>
					</div>
				</Card>
			{/each}
		</div>
	</section>

	<section
		id="private"
		class="border-border box-gradient scroll-mt-[var(--scroll-offset)] rounded-lg border p-8"
	>
		<HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
			<h2 id="private-heading" class="mt-0">Also Running</h2>
			<p class="mb-0">
				Private, or mine rather than yours. Listed because they are part of the same flake, not
				linked because there is nothing useful for a visitor behind them.
			</p>
		</HeadingCopy>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each PRIVATE_SERVICES as service (service.name)}
				<Card>
					<div class="prose dark:prose-invert">
						<h3 class="mt-0 text-xl font-semibold">
							{#if service.page}
								<a href={service.page} target="_blank" rel="noopener noreferrer">{service.name}</a>
								<p class="mt-1 mb-0 font-mono text-sm break-all text-subtextcol">
									{service.displayPage || new SvelteURL(service.page).hostname}
								</p>
							{:else}
								{service.name}
							{/if}
						</h3>
						<div class="mt-3">{@html marked(service.description)}</div>
					</div>
				</Card>
			{/each}
		</div>
	</section>
</div>
