<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		label,
		buttons = 'never'
	}: {
		children: Snippet;
		label: string;
		/** Arrow buttons: never (swipe only), always, or from the md breakpoint up. */
		buttons?: 'never' | 'always' | 'md-up';
	} = $props();

	let track = $state<HTMLElement>();

	// Full class strings, so Tailwind sees them.
	const buttonDisplay = $derived(
		{ never: 'hidden', always: 'flex', 'md-up': 'hidden md:flex' }[buttons]
	);

	function step(direction: 1 | -1) {
		if (!track) return;
		const item = track.firstElementChild as HTMLElement | null;
		const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
		track.scrollBy({
			left: direction * ((item?.offsetWidth ?? track.clientWidth) + gap),
			behavior: 'smooth'
		});
	}
</script>

<div class="flex items-center gap-2" role="region" aria-label={label}>
	<button
		class="{buttonDisplay} border-border card size-9 shrink-0 items-center justify-center rounded-full border"
		aria-label="Previous"
		onclick={() => step(-1)}>←</button
	>
	<!-- Center snapping: the ends cannot scroll past the edge, so the first and last
		items settle flush left and right, and everything between lands in the middle. -->
	<div
		bind:this={track}
		class="scrollbar-hide flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [&>*]:w-[min(16rem,80%)] [&>*]:shrink-0 [&>*]:snap-center"
	>
		{@render children()}
	</div>
	<button
		class="{buttonDisplay} border-border card size-9 shrink-0 items-center justify-center rounded-full border"
		aria-label="Next"
		onclick={() => step(1)}>→</button
	>
</div>
