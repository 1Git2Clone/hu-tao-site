import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { skavex } from '@skavex/skavex/vite';
import { defineConfig } from 'vite-plus';
import path from 'path';

import { remarkReadingTime } from './plugins/remark/reading-time.js';
import { remarkCodeBlock } from './plugins/remark/code-block.js';
import { remarkBlogAssets } from './plugins/remark/blog-assets.js';
import { rehypeHeadings } from './plugins/rehype/headings.js';

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

			// Maths, GFM and brace escaping are skavex's. Everything below is this
			// site's own, because everything below is a choice about this site:
			// which headings the table of contents shows, how a code block looks,
			// where a post's images live, how a reading time is worded.
			remarkPlugins: [remarkCodeBlock, remarkBlogAssets, remarkReadingTime],

			// skavex runs these BEFORE KaTeX, which is the whole reason the heading
			// collector can go here: it reads the prose an author wrote rather than
			// KaTeX's markup, so an anchor never changes when KaTeX changes.
			// h2 and h3 only — the table of contents styles exactly those two, so a
			// deeper heading would arrive unindented and read like a section.
			rehypePlugins: [[rehypeHeadings, { levels: [2, 3] }]]
		}),
		sveltekit(),
		tailwindcss()
	],
	resolve: { alias: { $lib: path.resolve('./src/lib') } },
	server: {
		host: true
	},

	// Oxfmt, set up the way Prettier and its svelte and tailwindcss plugins were.
	fmt: {
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100,
		svelte: {},
		sortTailwindcss: { stylesheet: './src/routes/layout.css' },
		ignorePatterns: [
			'build/**',
			'.svelte-kit/**',
			'static/**',
			'pnpm-lock.yaml',
			'package-lock.json'
		]
	},

	lint: {
		ignorePatterns: ['build/**', '.svelte-kit/**', 'static/**'],
		options: { typeAware: true }
	}
});
