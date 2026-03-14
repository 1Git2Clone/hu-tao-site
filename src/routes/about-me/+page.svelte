<script lang="ts">
	type DevOps = 'Docker' | 'Kubernetes' | 'GitHub Actions';
	type Libraries = 'React' | 'Svelte' | 'TailwindCSS' | 'Axum' | 'Actix' | 'Prometheus' | 'Grafana';
	type Languages =
		| 'TypeScript'
		| 'Python'
		| 'Rust'
		| 'Go'
		| 'C++'
		| 'C'
		| 'C#'
		| 'PHP'
		| 'Ruby'
		| 'Java'
		| 'Kotlin';
	type Tag = 'web' | 'ai' | 'systems' | 'tooling' | 'personal';

	interface Project {
		title: string;
		image?: string;
		techStack: {
			devops: DevOps[];
			libraries: Libraries[];
			languages: Languages[];
		};
		summary: string;
		description: string;
		tags: Tag[];
	}

	const projects: Project[] = [
		{
			title: 'Project Alpha',
			image: '/images/project-alpha.png',
			techStack: {
				devops: ['Docker', 'GitHub Actions'],
				libraries: ['Svelte', 'TailwindCSS'],
				languages: ['TypeScript', 'Python']
			},
			summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
			description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. voluptatibus culpa possimus
reiciendis odio.`,
			tags: ['web', 'tooling']
		},
		{
			title: 'Project Beta',
			image: '/images/project-beta.png',
			techStack: {
				devops: ['Kubernetes'],
				libraries: ['React'],
				languages: ['TypeScript', 'Go']
			},
			summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
			description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. voluptatibus culpa possimus
reiciendis odio.`,
			tags: ['ai', 'systems']
		},
		{
			title: 'Project Gamma',
			image: '/images/project-gamma.png',
			techStack: {
				devops: [],
				libraries: ['Grafana'],
				languages: ['Python']
			},
			summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
			description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
Cupiditate numquam molestias cumque placeat a iste, eveniet eius modi nihil
voluptatum doloribus sed ut aliquid dicta. Voluptatibus culpa possimus
reiciendis odio.`,
			tags: ['personal', 'web']
		}
	];
</script>

<div class="space-y-8">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 class="text-center text-4xl font-bold tracking-tight">1Git2Clone</h1>
		<div class="text-center">
			<sub>Student | Junior AI Developer | Aspiring Systems Engineer</sub>
		</div>
		<p class="text-muted-foreground mt-4 text-center text-lg">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate numquam molestias cumque
			placeat a iste, eveniet eius modi nihil voluptatum doloribus sed ut aliquid dicta.
			Voluptatibus culpa possimus reiciendis odio.
		</p>
	</section>

	<section class="grid gap-6 md:grid-cols-3">
		{#each projects as project}
			<div class="border-border rounded-lg border p-6">
				{#if project.image}
					<img src={project.image} alt={`${project.title} Cover Image`} class="mb-4 rounded" />
				{/if}

				<h2 class="text-xl font-semibold">{project.title}</h2>
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
