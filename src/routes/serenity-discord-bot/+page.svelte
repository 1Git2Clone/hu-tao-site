<script lang="ts">
	// Reason: Supposed to be external urls
	/* eslint-disable svelte/no-navigation-without-resolve */

	import Card from '$lib/components/layout/Card.svelte';
	import HeadingCopy from '$lib/components/HeadingCopy.svelte';
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import { TECH_URLS } from '$lib/content/about-me/projects';

	const OAUTH_URL = 'https://discord.com/oauth2/authorize?client_id=1211325231659089920';
	const SOURCE_URL = 'https://github.com/1Git2Clone/serenity-discord-bot';
	const BOT_CARD_IMG =
		'https://raw.githubusercontent.com/1Git2Clone/serenity-discord-bot/main/assets/bot-profile.png';

	const SITE_URL = 'https://1g2c.netlify.app';
	const title = 'Serenity Discord Bot | 1Git2Clone';
	const description =
		'A Hu Tao-themed async Discord bot built with Rust, Serenity, and Poise. XP levelling, interaction commands, AI persona, and sub-100ms response times.';
	const canonical = `${SITE_URL}/serenity-discord-bot`;

	type Feature = { heading: string; body: string };

	const FEATURES: Feature[] = [
		{
			heading: 'XP Levelling',
			body: 'Server-wide XP with a 60-second cooldown, stored in PostgreSQL. Check the leaderboard with /toplevels.'
		},
		{
			heading: 'Interaction Commands',
			body: 'pat, hug, kiss, slap, punch, bonk, nom, kill, kick, bury, peek, avatar, drive, chair, boom, quote — and more.'
		},
		{
			heading: 'Reminders',
			body: 'Schedule reminders with full timezone support. Create, list, search, and delete via /reminder.'
		},
		{
			heading: 'AI Persona',
			body: 'In-character responses via /ai or always-on /aichannel. Supports DeepSeek, Ollama, Anthropic, OpenAI, Google, and Groq.'
		},
		{
			heading: 'Prefix & Typo Correction',
			body: 'Responds to both slash commands and hu / ht prefixes. Levenshtein distance catches typos automatically.'
		},
		{
			heading: 'Observability',
			body: 'Optional Tokio Console for async runtime inspection and OpenTelemetry tracing with Grafana Tempo support.'
		}
	];

	function techLink(key: keyof typeof TECH_URLS) {
		return TECH_URLS[key];
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="https://1g2c.netlify.app/og-image.jpg" />
</svelte:head>

<div class="space-y-8">
	<!-- Hero -->
	<section
		class="border-border box-gradient hero prose min-w-full rounded-lg border p-8 dark:prose-invert"
	>
		<h1 id="title" class="mb-2 text-center">Serenity Discord Bot</h1>
		<p class="text-center text-sm text-subtextcol">
			Hu Tao-themed · Rust · Async · Sub-100ms responses
		</p>

		<blockquote>
			Best girl (Hu Tao) bot. Works with prefix and slash commands — backed by
			<em>Serenity, Poise, and Tokio</em> for non-blocking performance at scale.
		</blockquote>

		<p>
			An asynchronous Discord bot with reactive PostgreSQL integrations, XP levelling, a full suite
			of interaction commands, and an optional AI persona powered by your choice of LLM provider.
			Open-source under the Apache 2.0 license.
		</p>

		<div class="mt-6 flex flex-wrap justify-center gap-4">
			<a
				href={OAUTH_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="invite-btn inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold no-underline"
			>
				Add to Server
			</a>
			<a
				href={SOURCE_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-sm"
			>
				<GitHub width={16} height={16} />
				View Source
			</a>
		</div>
	</section>

	<!-- Bot card + quick info -->
	<section class="grid gap-6 md:grid-cols-2">
		<!-- Discord bot account card -->
		<Card>
			<div class="flex flex-col items-center gap-4">
				<div class="bot-card w-full overflow-hidden rounded-xl">
					<img
						src={BOT_CARD_IMG}
						alt="Hu Tao Discord bot account card"
						class="h-auto w-full rounded-xl"
					/>
					<div class="bot-card-inner rounded-xl"></div>
				</div>

				<a
					href={OAUTH_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="invite-btn inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold no-underline"
				>
					Add Hu Tao to Your Server
				</a>
			</div>
		</Card>

		<!-- Quick info -->
		<Card>
			<div class="prose dark:prose-invert">
				<h2 class="mt-0 text-xl font-semibold">Quick Info</h2>

				<ul class="text-muted-foreground mt-2 text-sm">
					<li><strong>Name:</strong> Hu Tao <span class="bot-badge">BOT</span></li>
					<li><strong>Prefixes:</strong> hu, ht (+ slash commands)</li>
					<li><strong>Created:</strong> Feb 25, 2024</li>
					<li>
						<strong>License:</strong>
						<a
							href="https://www.apache.org/licenses/LICENSE-2.0"
							target="_blank"
							rel="noopener noreferrer">Apache 2.0</a
						>
					</li>
				</ul>

				<h3 class="text-base font-semibold">Tech Stack</h3>
				<ul class="text-muted-foreground mt-2 text-sm">
					<li>
						<strong>Language:</strong>
						<a href={techLink('Rust').url} target="_blank" rel="noopener noreferrer">Rust</a>
					</li>
					<li>
						<strong>Async runtime:</strong>
						<a href={techLink('Tokio').url} target="_blank" rel="noopener noreferrer">Tokio</a>
					</li>
					<li>
						<strong>Discord framework:</strong>
						<a href={techLink('Serenity').url} target="_blank" rel="noopener noreferrer">Serenity</a
						> +
						<a href={techLink('Poise').url} target="_blank" rel="noopener noreferrer">Poise</a>
					</li>
					<li>
						<strong>Database:</strong>
						<a href={techLink('PostgreSQL').url} target="_blank" rel="noopener noreferrer"
							>PostgreSQL</a
						>
					</li>
					<li><strong>Caching:</strong> Redis</li>
					<li>
						<strong>Observability:</strong>
						<a href={techLink('OpenTelemetry').url} target="_blank" rel="noopener noreferrer"
							>OpenTelemetry</a
						> ·
						<a href={techLink('Grafana').url} target="_blank" rel="noopener noreferrer">Grafana</a>
					</li>
					<li>
						<strong>Containers:</strong>
						<a href={techLink('Docker').url} target="_blank" rel="noopener noreferrer">Docker</a>
					</li>
				</ul>

				<div class="mt-4 text-sm">
					<a
						href={SOURCE_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1"
					>
						Read more <span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</Card>
	</section>

	<!-- Features -->
	<section id="features" class="border-border box-gradient scroll-mt-22 rounded-lg border p-8">
		<HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
			<h2 id="features-heading" class="mt-0">Features</h2>
			<p class="mb-0">What the bot does out of the box.</p>
		</HeadingCopy>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each FEATURES as feature (feature.heading)}
				<Card>
					<div class="prose dark:prose-invert">
						<h3 class="mt-0 text-base font-semibold">{feature.heading}</h3>
						<p class="text-muted-foreground mb-0 text-sm">{feature.body}</p>
					</div>
				</Card>
			{/each}
		</div>
	</section>

	<!-- CTA footer -->
	<div
		class="border-border prose min-w-full rounded-lg border p-6 text-center dark:prose-invert"
	>
		<h2 id="add-to-server" class="mt-0">Ready to add it to your server?</h2>
		<p class="mb-4">
			Open-source and self-hostable. Add the live bot or fork the repo and run your own instance.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a
				href={OAUTH_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="invite-btn inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold no-underline"
			>
				Add to Server
			</a>
			<a
				href={SOURCE_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-sm"
			>
				<GitHub width={16} height={16} />
				github.com/1Git2Clone/serenity-discord-bot
			</a>
		</div>
	</div>
</div>

<style>
	.invite-btn {
		background-color: var(--color-accent);
		color: white;
		border: 1px solid transparent;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.invite-btn:hover {
		background-color: var(--color-accent-hover);
		color: white;
		box-shadow: 0 0 12px rgba(220, 38, 38, 0.3);
	}

	.bot-badge {
		display: inline-block;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
		background-color: var(--color-accent);
		color: white;
		vertical-align: middle;
		line-height: 1.4;
	}

	.bot-card {
		position: relative;
	}

	.bot-card-inner {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(to top, var(--color-img-inner-border), transparent 20%),
			linear-gradient(to bottom, var(--color-img-inner-border), transparent 20%),
			linear-gradient(to left, var(--color-img-inner-border), transparent 40%),
			linear-gradient(to right, var(--color-img-inner-border), transparent 40%);
	}
</style>
