<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher';
</script>

<button
	on:click={toggleMode}
	class="relative flex size-10 items-center justify-center"
	aria-label="Toggle theme"
>
	<span class="absolute inset-0"></span>
	<span
		class="flex items-center justify-center text-2xl leading-none text-accent"
		style={mode.current === 'dark' /* align font in the center */
			? `transform: translateX(-2.65px);`
			: `transform: translateX(-3.9px);`}
	>
		{#if mode.current === 'dark'}
			
		{:else}
			
		{/if}
	</span>
</button>
