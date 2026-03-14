<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher';
	import '$lib/styles/font.css';
</script>

<button onclick={toggleMode} class="flex">
	{#if mode.current === 'dark'}
		
	{:else}
		
	{/if}
</button>
