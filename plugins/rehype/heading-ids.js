import { visit } from 'unist-util-visit';
import { slugify } from '../utils.js';
import { toString } from 'mdast-util-to-string';

export function rehypeHeadingIds() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (['h2', 'h3'].includes(node.tagName)) {
				node.properties.id = slugify(toString(node));
			}
		});
	};
}
