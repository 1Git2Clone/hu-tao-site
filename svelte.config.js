import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Markdown posts are compiled by skavex, which is a Vite plugin and therefore
 * configured in vite.config.ts — not here. What this file has to say about
 * markdown is the extension list.
 *
 * `.md` must appear here as well: skavex turns markdown into Svelte source,
 * and vite-plugin-svelte only compiles a file whose extension it recognises.
 * Leave it out and the browser is served component source as a module.
 *
 * @type {import('@sveltejs/kit').Config}
 */
export default {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess()],
	kit: {
		inlineStyleThreshold: 5000,
		adapter: adapter()
	}
};
