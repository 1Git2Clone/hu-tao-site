import { visit } from 'unist-util-visit';
import { slugify } from '../utils.js';
import { toString } from 'mdast-util-to-string';
import katex from 'katex';

export function remarkHeadings() {
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
