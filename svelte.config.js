import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'path';
import remarkMath from 'remark-math';

import { remarkHeadings } from './plugins/remark/headings.js';
import { remarkReadingTime } from './plugins/remark/reading-time.js';
import { remarkYouTube } from './plugins/remark/youtube.js';
import { remarkCodeBlock } from './plugins/remark/code-block.js';

import { REHYPE_KATEX } from './plugins/rehype/katex.js';
import { rehypeHeadingIds } from './plugins/rehype/heading-ids.js';
import { remarkBlogAssets } from './plugins/remark/blog-assets.js';

/** @type {import('@sveltejs/kit').Config} */
export default {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			layout: {
				_: path.resolve('src/lib/components/blog/MarkdownLayout.svelte')
			},
			remarkPlugins: [
				remarkYouTube,
				remarkCodeBlock,
				remarkBlogAssets,
				remarkMath,
				remarkReadingTime,
				remarkHeadings
			],
			rehypePlugins: [rehypeHeadingIds, REHYPE_KATEX]
		})
	],
	kit: {
		inlineStyleThreshold: 5000,
		adapter: adapter()
	}
};
