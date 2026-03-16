<script lang="ts">
	let { id, title = 'YouTube video' } = $props();
</script>

<div class="video-container">
	<iframe
		src="https://www.youtube.com/embed/{id}"
		{title}
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</div>

<style>
	.video-container {
		width: 100%;
		aspect-ratio: 16 / 9;
		margin: 2rem 0;
	}
	iframe {
		width: 100%;
		height: 100%;
		border-radius: 0.75rem;
	}
</style>
