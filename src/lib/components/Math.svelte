<script>
	import katex from 'katex';
	export let math = ``;
	export let display = false;
</script>

<span class="math-wrapper">
	{@html katex.renderToString(math, {
		throwOnError: false,
		displayMode: display
	})}
</span>

<style>
	.math-wrapper {
		display: inline-block;
		vertical-align: middle;
	}
</style>
