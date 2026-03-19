<script lang="ts">
	// Reason: Supposed to be external urls
	/* eslint-disable svelte/no-navigation-without-resolve */

	// Reason: Content is written by me.
	/* eslint-disable svelte/no-at-html-tags */

	import { slugify } from '$lib/utils/slugify';
	import { PROJECTS } from '$lib/content/about-me/projects';
	import { marked } from 'marked';
	import { hostToSocial, type SocialMedia } from '$lib/types/social-media';

	function getSocialMedia(hostname: string): SocialMedia {
		return hostToSocial[hostname];
	}
</script>

<div class="space-y-8">
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert"
	>
		<h1 id="title" class="mb-2 text-center">1Git2Clone</h1>
		<div class="text-center text-sm text-subtextcol">
			Student | Junior AI Developer | Aspiring Systems Engineer
		</div>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate numquam molestias cumque
			placeat a iste, eveniet eius modi nihil voluptatum doloribus sed ut aliquid dicta.
			Voluptatibus culpa possimus reiciendis odio.
		</p>
	</section>

	<section class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each PROJECTS as project, i (project.title + i)}
			{@const slug = slugify(project.title)}
			<div
				class="border-border prose min-w-full rounded-lg border p-6 md:last:col-span-2 dark:prose-invert"
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
						{#if project.techStack.devops?.length}
							<li>DevOps: {project.techStack.devops.join(', ')}</li>
						{/if}
						{#if project.techStack.observability?.length}
							<li>Observability: {project.techStack.observability.join(', ')}</li>
						{/if}
						{#if project.techStack.frontendLibraries?.length}
							<li>Frontend Libraries: {project.techStack.frontendLibraries.join(', ')}</li>
						{/if}
						{#if project.techStack.backendLibraries?.length}
							<li>Backend Libraries: {project.techStack.backendLibraries.join(', ')}</li>
						{/if}
						{#if project.techStack.databases?.length}
							<li>Databases: {project.techStack.databases.join(', ')}</li>
						{/if}
						{#if project.techStack.aiIntegrations?.length}
							<li>AI Integrations: {project.techStack.aiIntegrations.join(', ')}</li>
						{/if}
						<li>Languages: {project.techStack.languages.join(', ') || 'None'}</li>
					</ul>
				</div>

				<div id="{slug}-description">
					{@html marked(project.description)}
				</div>

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

				<div class="mt-4 text-sm">
					<strong>Tags:</strong>
					{project.tags.join(', ')}
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
