<script lang="ts">
	// Reason: Supposed to be external urls
	/* eslint-disable svelte/no-navigation-without-resolve */

	// Reason: Content is written by me.
	/* eslint-disable svelte/no-at-html-tags */

	import { marked } from 'marked';
	import { SvelteURL } from 'svelte/reactivity';

	import HeadingCopy from '$lib/components/HeadingCopy.svelte';
	import ForceOverview from '$lib/components/infra/ForceOverview.svelte';
	import {
		INFRA_STACK,
		PRIVATE_SERVICES,
		PUBLIC_SERVICES,
		type Service
	} from '$lib/content/infra/services';
	import { OVERVIEW } from '$lib/content/infra/topology';
	import { SITE_URL } from '$lib/utils/consts';

	const title = 'Infrastructure — 1Git2Clone';
	const description =
		'A self-hosted VPS described entirely in one NixOS flake: git hosting, CI, status, search, observability, and backups.';
	const canonical = `${SITE_URL}/infra`;

	const SOURCE_URL = 'https://git.hu-tao.dev/hutao/vps';

	let { data } = $props();
</script>

<!-- One box per section: the services are rows, like the projects on home. -->
{#snippet serviceTable(services: Service[])}
	<div class="prose min-w-full dark:prose-invert [&_td_blockquote]:my-2 [&_td_p]:my-0">
		<table>
			<thead>
				<tr><th>Service</th><th>What it is</th></tr>
			</thead>
			<tbody>
				{#each services as service (service.name)}
					<tr>
						<!-- Names and hosts, not prose: start-aligned (over the prose td rule that inherits
						     main's justify), and a host never breaks mid-word;
						     "grafana.hu-tao.dev • Tailnet only" may wrap only at the bullet. -->
						<td class="text-left!">
							{#if service.page}
								{@const host = service.displayPage || new SvelteURL(service.page).hostname}
								<a href={service.page} target="_blank" rel="noopener noreferrer"
									><strong>{service.name}</strong></a
								>
								<span class="block text-sm text-subtextcol">
									{#each host.split(/\s*•\s*/) as part, i (i)}
										{#if i > 0}{' • '}{/if}
										<span class="whitespace-nowrap">{part}</span>
									{/each}
								</span>
							{:else}
								<strong>{service.name}</strong>
							{/if}
						</td>
						<td>{@html marked(service.description)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

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
		id="overview"
		class="border-border box-gradient scroll-mt-[var(--scroll-offset)] rounded-lg border p-4 md:p-8"
	>
		<HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
			<h2 id="overview-heading" class="mt-0">Overview</h2>
			<p class="mb-0">Tap or click a box for what it does. With a mouse, drag them around.</p>
		</HeadingCopy>

		<ForceOverview graph={OVERVIEW} {...data.overview} />
	</section>

	<section
		id="public"
		class="border-border box-gradient scroll-mt-[var(--scroll-offset)] rounded-lg border p-8"
	>
		<HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
			<h2 id="public-heading" class="mt-0">Public</h2>
			<p class="mb-0">Reachable from anywhere, behind one reverse proxy and one certificate.</p>
		</HeadingCopy>

		{@render serviceTable(PUBLIC_SERVICES)}
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

		{@render serviceTable(PRIVATE_SERVICES)}
	</section>
</div>
