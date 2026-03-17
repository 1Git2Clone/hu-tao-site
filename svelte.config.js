import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import path from 'path';
import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { slugify } from './src/lib/utils/slugify.ts';
import { visit } from 'unist-util-visit';


function remarkHeadings() {
  return (tree, { data }) => {
    const headings = [];
    tree.children.forEach((node) => {
      if (node.type === 'heading' && [2, 3].includes(node.depth)) {
        const text = toString(node);

        const id = slugify(text);
        const cleanHtml = text
          .replace(/<Math math={[^}]*} \/>/g, '')
          .replace(/-/g, '')
          .trim();

        headings.push({
          id: id,
          html: cleanHtml,
          level: node.depth
        });
      }
    });
    data.fm.headings = headings;
  };
}

function rehypeHeadingIds() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (['h2', 'h3'].includes(node.tagName)) {
        // Generate the same clean ID as the TOC
        node.properties.id = slugify(toString(node));
      }
    });
  };
}

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
      remarkPlugins: [rehypeHeadingIds, remarkReadingTime, remarkHeadings],
      rehypePlugins: [rehypeSlug]
    })
  ],
  kit: {
    adapter: adapter()
  }
};
