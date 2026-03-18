<script lang="ts">
	// Reason: Supposed to be external urls
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { PROJECTS } from '$lib/content/about-me/projects';
</script>

<div class="space-y-8">
	<section
		class="border-border prose min-w-full rounded-lg border bg-muted/40 p-8 dark:prose-invert"
	>
		<h1 class="mb-2 text-center">1Git2Clone</h1>
		<div class="text-center">
			<sub>Student | Junior AI Developer | Aspiring Systems Engineer</sub>
		</div>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate numquam molestias cumque
			placeat a iste, eveniet eius modi nihil voluptatum doloribus sed ut aliquid dicta.
			Voluptatibus culpa possimus reiciendis odio.
		</p>
	</section>

	<section class="grid gap-6 md:grid-cols-2">
		{#each PROJECTS as project (project.title)}
			<div class="border-border prose min-w-full rounded-lg border p-6 dark:prose-invert">
				{#if project.image}
					<img src={project.image} alt={`${project.title} Cover Image`} class="mb-4 rounded" />
				{/if}

				<h2 class="mt-4 text-xl font-semibold">
					{#if project.source_url}
						<a
							href={project.source_url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`View ${project.title}' source code`}
						>
							{project.title}
						</a>
					{:else}
						{project.title}
					{/if}
				</h2>
				<p class="text-muted-foreground mt-2">{project.summary}</p>

				<div class="text-muted-foreground mt-2 text-sm">
					<strong>Tech Stack:</strong>
					<ul class="ml-4 list-disc">
						<li>DevOps: {project.techStack.devops.join(', ') || 'None'}</li>
						<li>Libraries: {project.techStack.libraries.join(', ') || 'None'}</li>
						<li>Languages: {project.techStack.languages.join(', ') || 'None'}</li>
					</ul>
				</div>

				<p class="text-muted-foreground mt-2">{project.description}</p>

				<div class="mt-4 text-sm">
					<strong>Tags:</strong>
					{project.tags.join(', ')}
				</div>
			</div>
		{/each}
	</section>
</div>
