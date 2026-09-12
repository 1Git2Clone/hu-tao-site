import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { skavex } from '@skavex/skavex/vite';
import { defineConfig } from 'vite';
import path from 'path';

import { remarkReadingTime } from './plugins/remark/reading-time.js';
import { remarkCodeBlock } from './plugins/remark/code-block.js';
import { remarkBlogAssets } from './plugins/remark/blog-assets.js';

export default defineConfig({
	plugins: [
		// Before sveltekit(): skavex turns markdown into Svelte source, which the
		// Svelte plugin then compiles. GFM, maths and brace escaping are skavex's
		// defaults; the plugins below are this site's own.
		skavex({
			layout: '/src/lib/components/blog/MarkdownLayout.svelte',

			// Where every component addressable from markdown lives — both the ones
			// plugins emit and the ones a post writes by hand, like <YouTube />.
			// Nothing declares an import; skavex resolves what a document uses.
			components: '/src/lib/components/md',

			// h2 and h3 only: the table of contents styles exactly those two, so a
			// deeper heading would arrive unindented and look like a section.
			headings: { levels: [2, 3] },

			// Heading ids, table-of-contents data and maths are skavex's; these are
			// the two jobs it deliberately does not do — syntax highlighting is a
			// choice, and reading time is this site's own formatting.
			remarkPlugins: [remarkCodeBlock, remarkBlogAssets, remarkReadingTime]
		}),
		sveltekit(),
		tailwindcss()
	],
	resolve: { alias: { $lib: path.resolve('./src/lib') } },
	server: {
		host: true
	}
});
