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

	function getSocialMedia(hostname: string): SocialMedia {
		return hostToSocial[hostname];
	}

	function techHtml(items: (keyof typeof TECH_URLS)[]): string {
		return items
			.map(
				(item) =>
					`<a href="${TECH_URLS[item]}" target="_blank" rel="noopener noreferrer">${item}</a>`
			)
			.join(', ');
	}
</script>

<div class="space-y-8">
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert"
	>
		<h1 id="title" class="mb-2 text-center">1Git2Clone</h1>
		<p class="text-center text-sm text-subtextcol">
			Backend Engineer | Go & Rust | Fintech & Developer Tooling
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
			Backend engineer focused on building reliable systems in fintech environments. Built
			production systems with Go and Rust — including microservices, REST APIs, and data pipelines
			on AWS (Lambda, S3, RDS). Worked on PCI-adjacent financial systems with strict correctness and
			data integrity requirements.
		</p>

		<p>
			I deliver working, <strong>correct code</strong> — not just generated output. I've caught and replaced
			fake parser implementations with proper AST-based solutions, redesigned broken data pipelines, and
			made architectural decisions that held up in production. I take ownership of problems beyond the
			immediate ticket.
		</p>

		<p>
			I have <strong>contributed to rust-random/rand</strong>, the standard Rust random number
			generation library used across the ecosystem. Available remotely for backend systems, fintech
			APIs, developer tooling, and cloud infrastructure.
		</p>

		<p class="mt-6">
			If you need reliable backend systems, data pipelines, or fintech infrastructure built right,
			get in touch.
			<a href="mailto:{EMAIL}" class="inline-flex items-center gap-1">{EMAIL}</a>
		</p>
	</section>

	<p>Projects focused on backend systems, data pipelines, and developer tooling:</p>

	<section class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each PROJECTS as project, i (project.title + i)}
			{@const slug = slugify(project.title)}
			<div
				class="border-border prose min-w-full rounded-lg border p-6 md:last:odd:col-span-2 dark:prose-invert"
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
							<li>Compute: {@html techHtml(project.techStack.compute)}</li>
						{/if}
						{#if project.techStack.storage?.length}
							<li>Storage: {@html techHtml(project.techStack.storage)}</li>
						{/if}
						{#if project.techStack.devops?.length}
							<li>DevOps: {@html techHtml(project.techStack.devops)}</li>
						{/if}
						{#if project.techStack.observability?.length}
							<li>Observability: {@html techHtml(project.techStack.observability)}</li>
						{/if}
						{#if project.techStack.frontendLibraries?.length}
							<li>Frontend Libraries: {@html techHtml(project.techStack.frontendLibraries)}</li>
						{/if}
						{#if project.techStack.backendLibraries?.length}
							<li>Backend Libraries: {@html techHtml(project.techStack.backendLibraries)}</li>
						{/if}
						{#if project.techStack.databases?.length}
							<li>Databases: {@html techHtml(project.techStack.databases)}</li>
						{/if}
						{#if project.techStack.aiIntegrations?.length}
							<li>AI Integrations: {@html techHtml(project.techStack.aiIntegrations)}</li>
						{/if}
						<li>Languages: {@html techHtml(project.techStack.languages) || 'None'}</li>
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
						{project.licenses.join(', ')}
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
							{project.sourceUrl.href}
						</a>
					{:else if project.isPrivate}
						Private / Confidential
					{/if}
				</div>
			</div>
		{/each}
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
