<script lang="ts">
	// Reason: Supposed to be external urls
	/* eslint-disable svelte/no-navigation-without-resolve */

	// Reason: Content is written by me.
	/* eslint-disable svelte/no-at-html-tags */

	import { slugify } from '$lib/utils/slugify';
	import { PROJECTS, TECH_URLS } from '$lib/content/about-me/projects';
	import { EMAIL, GITHUB_PROFILE_NAME } from '$lib/utils/consts';
	import { marked } from 'marked';
	import { hostToSocial, type SocialMedia } from '$lib/types/social-media';
	import GitHub from '$lib/components/icons/GitHub.svelte';
	import HeadingCopy from '$lib/components/HeadingCopy.svelte';

	function getSocialMedia(hostname: string): SocialMedia {
		return hostToSocial[hostname];
	}
</script>

{#snippet techLinks(items: (keyof typeof TECH_URLS)[])}
	{#each items as item, i (item)}
		<a href={TECH_URLS[item]} target="_blank" rel="noopener noreferrer">{item}</a>{i <
		items.length - 1
			? ', '
			: ''}
	{/each}
{/snippet}

<div class="space-y-8">
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert"
	>
		<h1 id="title" class="mb-2 text-center">1Git2Clone</h1>
		<p class="text-center text-sm text-subtextcol">
			AI Integration Developer | APIs, Data Pipelines & Internal Tools
		</p>
		<p class="mt-2 text-center">
			<a
				href="https://github.com/{GITHUB_PROFILE_NAME}"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2"
			>
				<GitHub width={16} height={16} />
				github.com/{GITHUB_PROFILE_NAME}
			</a>
		</p>

		<p>
			I'm Ivan, an AI integration developer working in fintech and building practical systems around
			LLMs, APIs, internal tools, and data pipelines. I turn operational workflows into production
			features that are useful, auditable, and maintainable.
		</p>

		<p>
			I build API backends, AI-backed dashboards, document processing tools, data ingestion flows,
			automation scripts, and developer tooling. Recent production work has involved OpenAI, Gemini,
			RAG/code graph systems, OCR, computer vision, and AWS services such as Lambda, S3, IAM, VPC,
			CloudWatch, and CloudFormation.
		</p>

		<p>
			I use Go professionally, prefer Rust for systems work, and am comfortable building interfaces
			with Svelte or React. I have
			<strong>
				<a
					href="https://github.com/rust-random/rand/pulls?q=is%3Apr+by%3A1Git2Clone"
					target="_blank"
					rel="noopener noreferrer">contributed to rust-random/rand</a
				>
			</strong>, the standard Rust random number generation library used across the ecosystem.
		</p>

		<p>
			Available remotely for AI integrations, API creation, data pipelines, internal tools, and
			backend infrastructure.
		</p>

		<p class="mt-6">
			If you need an AI feature, API, dashboard, or data pipeline turned into something that can run
			outside a demo, get in touch.
			<a href="mailto:{EMAIL}" class="inline-flex items-center gap-1">{EMAIL}</a>
		</p>

		<div class="border-border mt-6 rounded-lg border p-4 text-sm">
			<p class="mb-0">
				Async-friendly. I work from rough requirements to shipped tool. Remote-first, available for new contracts.
			</p>
		</div>
	</section>

	<section class="grid gap-6 md:grid-cols-2">
		<div class="border-border rounded-lg border bg-muted/40 p-6">
			<h3 class="text-lg font-semibold">API Creation</h3>
			<p class="text-muted-foreground mb-0 text-sm">Go services and AWS Lambda pipelines that handle async workflows, data ingestion, and backend glue for production systems.</p>
		</div>

		<div class="border-border rounded-lg border bg-muted/40 p-6">
			<h3 class="text-lg font-semibold">AI Integration</h3>
			<p class="text-muted-foreground mb-0 text-sm">LLM features, RAG systems, document processing, and AI-backed automation that remain useful outside the demo.</p>
		</div>

		<div class="border-border rounded-lg border bg-muted/40 p-6">
			<h3 class="text-lg font-semibold">Internal Dashboards & Tooling</h3>
			<p class="text-muted-foreground mb-0 text-sm">Svelte/React admin interfaces, observability dashboards, and operational tools that teams actually use.</p>
		</div>

		<div class="border-border rounded-lg border bg-muted/40 p-6">
			<h3 class="text-lg font-semibold">Data Pipelines</h3>
			<p class="text-muted-foreground mb-0 text-sm">ETL flows, streaming consumers, and analytics infrastructure that scales from batch to event-driven workloads.</p>
		</div>
	</section>

	<section id="projects" class="scroll-mt-22 border-border rounded-lg border bg-muted/40 p-8">
		<HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
			<h2 id="projects-heading" class="mt-0">Work Beyond Home (localhost)</h2>
			<p class="mb-0">Things that actually shipped.</p>
		</HeadingCopy>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each PROJECTS as project, i (project.title + i)}
				{@const slug = slugify(project.title)}
				<div class="md:last:odd:col-span-2 md:last:odd:mx-auto md:last:odd:w-[calc(50%-0.75rem)]">
					<div
						class="border-border prose h-full min-w-full rounded-lg border p-6 dark:prose-invert"
					>
						{#if project.image}
							<div class="relative mb-4 overflow-hidden rounded">
								<img
									src={project.image.source}
									alt={`${project.title} Cover Image`}
									class="h-36 w-full rounded-xl"
									style="
                object-fit: {project.image.css.cssObjectFit};
                object-position: {project.image.css.cssObjectPosition}
              "
								/>

								<div class="project-image-border rounded-xl"></div>

								{#if project.sourceUrl}
									<a
										href={project.image.artistLink.href}
										target="_blank"
										rel="noopener noreferrer"
										class="absolute right-2 bottom-2 rounded bg-primary/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors"
									>
										Credit: {project.image.artistName} on
										{getSocialMedia(project.image.artistLink.hostname)}
									</a>
								{/if}
							</div>
						{/if}

						<h2 id={slug} class="{project.image ? 'mt-4' : ''} text-xl font-semibold">
							{#if project.sourceUrl}
								<a
									href={project.sourceUrl.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`View ${project.title} source code`}
									title={`View source code on ${project.sourceUrl.hostname}.`}
								>
									{project.title}
								</a>
							{:else}
								{project.title}
							{/if}
						</h2>
						<p class="text-muted-foreground mt-2">{project.summary}</p>

						<div class="text-muted-foreground mt-2 text-sm">
							<h3 id="{slug}-tech-stack" class="mt-0">Tech Stack:</h3>
							<ul class="ml-4 list-disc">
								{#if project.techStack.compute?.length}
									<li>Compute: {@render techLinks(project.techStack.compute)}</li>
								{/if}
								{#if project.techStack.storage?.length}
									<li>Storage: {@render techLinks(project.techStack.storage)}</li>
								{/if}
								{#if project.techStack.devops?.length}
									<li>DevOps: {@render techLinks(project.techStack.devops)}</li>
								{/if}
								{#if project.techStack.observability?.length}
									<li>Observability: {@render techLinks(project.techStack.observability)}</li>
								{/if}
								{#if project.techStack.frontendLibraries?.length}
									<li>
										Frontend Libraries: {@render techLinks(project.techStack.frontendLibraries)}
									</li>
								{/if}
								{#if project.techStack.backendLibraries?.length}
									<li>
										Backend Libraries: {@render techLinks(project.techStack.backendLibraries)}
									</li>
								{/if}
								{#if project.techStack.databases?.length}
									<li>Databases: {@render techLinks(project.techStack.databases)}</li>
								{/if}
								{#if project.techStack.aiIntegrations?.length}
									<li>AI Integrations: {@render techLinks(project.techStack.aiIntegrations)}</li>
								{/if}
								<li>
									Languages: {#if project.techStack.languages.length}{@render techLinks(
											project.techStack.languages
										)}{:else}None{/if}
								</li>
							</ul>
						</div>

						<div id="{slug}-description">
							{@html marked(project.description)}
						</div>

						{#if project.licenses.length}
							<div class="mt-4 text-sm">
								<strong>
									{#if project.licenses.length > 1}
										Licenses
									{:else}
										License
									{/if}
								</strong>:
								{@render techLinks(project.licenses)}
							</div>
						{/if}

						<div class="mt-4 text-sm">
							<strong>Tags:</strong>
							{project.tags.join(', ')}
						</div>

						<div class="mt-4 text-sm">
							{#if project.sourceUrl}
								<a
									href={project.sourceUrl.href}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1"
								>
									Read more <span aria-hidden="true">→</span>
								</a>
							{:else if project.isPrivate}
								<span class="text-muted-foreground">Available on request</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div
			class="border-border prose mt-6 min-w-full rounded-lg border p-6 text-center dark:prose-invert"
		>
			<h2 id="contact" class="mt-0">Got A Messy Idea Worth Shipping?</h2>
			<p class="mb-0">
				Send me the rough version. I'll help turn it into something real:
				<a href="mailto:{EMAIL}" class="inline-flex items-center gap-1">{EMAIL}</a>.
			</p>
		</div>
	</section>
</div>

<style>
	.project-image-border {
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
