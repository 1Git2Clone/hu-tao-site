import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'path';
import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';

function slugify(text) {
  return text
    .toString()
    .replace(/<[^>]*\/>/g, '')
    .replace(/{[^}]*}/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function remarkHeadings() {
  return (tree, { data }) => {
    const headings = [];

    visit(tree, 'heading', (node) => {
      if ([2, 3].includes(node.depth)) {
        const htmlContent = node.children
          .map((child) => {
            if (child.type === 'inlineMath') {
              return katex.renderToString(child.value, {
                throwOnError: false,
                output: 'html'
              });
            }
            return toString(child);
          })
          .join('');

        const id = slugify(toString(node));

        headings.push({
          id: id,
          html: htmlContent,
          level: node.depth
        });
      }
    });

    if (!data.fm) data.fm = {};
    data.fm.headings = headings;
  };
}

function rehypeHeadingIds() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (['h2', 'h3'].includes(node.tagName)) {
        node.properties.id = slugify(toString(node));
      }
    });
  };
}

function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const stats = readingTime(textOnPage);
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
        _: path.resolve('src/lib/components/blog/MarkdownLayout.svelte')
      },
      remarkPlugins: [remarkMath, remarkReadingTime, remarkHeadings],
      rehypePlugins: [[rehypeKatex, {
        output: 'html',
        strict: false
      }], rehypeHeadingIds]
    })
  ],
  kit: {
    adapter: adapter()
  }
};
