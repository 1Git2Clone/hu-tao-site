<script lang="ts">
	// Nothing needed here yet
</script>

<div class="space-y-8">
	<section class="border-border rounded-lg border bg-muted/40 p-8">
		<h1 class="text-4xl font-bold tracking-tight">Welcome to 1k2s</h1>
		<p class="text-muted-foreground mt-4 text-lg">
			Your new SvelteKit project. No fighting, just building.
		</p>
	</section>

	<section class="grid gap-6 text-center md:grid-cols-3">
		{#each [1, 2, 3] as i}
			<div class="border-border rounded-lg border p-6">
				<h2 class="text-xl font-semibold">Feature {i}</h2>
				<p class="text-muted-foreground mt-2">
					This is a card component that will respect your theme preferences.
				</p>
			</div>
		{/each}
	</section>
</div>
