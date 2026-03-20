<script lang="ts">
	import { onMount } from 'svelte';
	import Prism from 'prismjs';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-rust';
	import 'prismjs/components/prism-python';

	let { children, lang } = $props();

	let copied = $state(false);
	let codeElement: HTMLElement | undefined = $state();

	let detectedLang = $derived(lang || 'javascript');

	function copy() {
		const text = codeElement?.innerText || '';
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 1250);
	}

	onMount(() => {
		if (codeElement && !codeElement.querySelector('.token')) {
			Prism.highlightElement(codeElement);
		}
	});
</script>

<div
	class="group border-border relative my-6 w-full min-w-0 overflow-hidden rounded-lg border bg-black/50 text-sm"
>
	<div class="border-border flex items-center justify-between border-b bg-muted/50 px-4 py-2">
		<span class="text-muted-foreground font-mono text-xs">{detectedLang}</span>
		<button onclick={copy} class="size-8 text-xs transition-colors hover:text-accent">
			<span class="translate-x[-50%] absolute translate-y-[-50%]">
				{copied ? ' ' : ' '}
			</span>
		</button>
	</div>
	<pre
		class="w-full overflow-x-auto p-4 whitespace-pre"
		style="margin: 0; /* for some reason it didn't work with tailwind's `m-0`*/"><code
			bind:this={codeElement}
			class="language-{detectedLang}">{@render children?.()}</code
		></pre>
</div>
