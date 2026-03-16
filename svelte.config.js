import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import path from 'path';
import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import toc from 'rehype-toc';

/**
 * Custom plugin to inject reading time into frontmatter
 */
function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const stats = readingTime(textOnPage);

    // Ensure data and fm exist
    if (!data.fm) data.fm = {};

    data.fm.readingTime = stats.text;
  };
}

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      layout: {
        _: path.resolve('src/lib/components/MarkdownLayout.svelte')
      },
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [rehypeSlug]
    })
  ],
  kit: {
    adapter: adapter()
  }
};
