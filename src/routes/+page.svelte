<script lang="ts">
	import { SITE_TITLE, SITE_TAGLINE, GITHUB_PROFILE_NAME, EMAIL } from '$lib/utils/consts';
	import { resolve } from '$app/paths';
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Card from '$lib/components/layout/Card.svelte';

	const SITE_URL = 'https://1g2c.netlify.app';
	const title = '1Git2Clone';
	const description =
		'Building AI integrations, APIs, data pipelines, and internal tools that work in production.';
	const canonical = `${SITE_URL}/`;
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

<div class="prose w-full max-w-none space-y-8 dark:prose-invert">
	<section class="border-border box-gradient rounded-lg border p-8">
		<h1 id="title" class="text-4xl font-bold tracking-tight">Welcome to {SITE_TITLE}!</h1>
		<p class="text-lg text-subtextcol">
			{SITE_TAGLINE}
		</p>

		<p>
			I build AI integrations, API backends, internal dashboards, document processing tools, and
			data pipelines that run in production.
		</p>

		<div class="mt-6 flex flex-wrap gap-6 text-sm">
			<a href={resolve('/about-me')} class="inline-flex items-center gap-1 font-semibold">
				View work <span aria-hidden="true">→</span>
			</a>
			<a href={resolve('/blogs')} class="inline-flex items-center gap-1">
				Read the blogs <span aria-hidden="true">→</span>
			</a>
			<a href={`https://github.com/${GITHUB_PROFILE_NAME}`} class="inline-flex items-center gap-1">
				<GitHub width={18} height={18} />
				GitHub
			</a>
		</div>
	</section>

	<section class="border-border box-gradient rounded-lg border p-8">
		<h2 id="what-i-build" class="mt-0">What I Build</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card>
				<h3 id="ai-integrations" class="mt-0 text-lg">AI Integrations</h3>
				<p class="mb-0 text-sm">
					LLM-backed features, RAG/code graph workflows, OCR, computer vision, and internal
					automation that is useful after the first demo.
				</p>
			</Card>

			<Card>
				<h3 id="apis-data-flows" class="mt-0 text-lg">APIs & Data Flows</h3>
				<p class="mb-0 text-sm">
					Go services, AWS Lambda pipelines, S3-backed processing, audit-friendly data handling, and
					backend glue for real workflows.
				</p>
			</Card>

			<Card>
				<h3 id="interfaces-tools" class="mt-0 text-lg">Interfaces & Tools</h3>
				<p class="mb-0 text-sm">
					Svelte/React dashboards, admin tools, developer tooling, and Rust systems projects when
					the problem needs lower-level control.
				</p>
			</Card>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="border-border box-gradient rounded-lg border p-8">
			<h2 id="proof" class="mt-0">Work</h2>
			<p>Confidential fintech systems, AI admin tooling, and public Rust projects.</p>
			<a href="{resolve('/about-me')}#projects" class="inline-flex items-center gap-1">
				See details <span aria-hidden="true">→</span>
			</a>
		</div>

		<div class="border-border box-gradient rounded-lg border p-8">
			<h2 id="notes" class="mt-0">Notes From The Terminal</h2>
			<p>
				Writing on algorithms, Linux, tooling, and the parts of software that become clearer when
				you explain them.
			</p>
			<div class="flex flex-wrap gap-6 text-sm">
				<a href={resolve('/blogs')} class="inline-flex items-center gap-1">
					Blogs <span aria-hidden="true">→</span>
				</a>
				<a href={resolve('/journey')} class="inline-flex items-center gap-1">
					Linux journey <span aria-hidden="true">→</span>
				</a>
				<a href={resolve('/infra')} class="inline-flex items-center gap-1">
					Infra <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</section>

	<section class="border-border box-gradient rounded-lg border p-8 text-center">
		<h2 id="contact" class="mt-0">Contact</h2>
		<p class="mb-0">
			<a href="mailto:{EMAIL}" class="inline-flex items-center gap-1">{EMAIL}</a>
		</p>
	</section>
</div>
