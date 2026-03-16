<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher';
	import '$lib/styles/font.css';
</script>

<button
	on:click={toggleMode}
	class="relative flex size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900"
	aria-label="Toggle theme"
>
	<span class="absolute inset-0"></span>
	<span
		class="flex items-center justify-center text-2xl leading-none"
		style={mode.current === 'dark' /* align font in the center */
			? `transform: translateX(-2.6px);`
			: `transform: translateX(-4.0px);`}
	>
		{#if mode.current === 'dark'}
			
		{:else}
			
		{/if}
	</span>
</button>
