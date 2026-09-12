import { visit } from 'unist-util-visit';
import { componentNode } from '@skavex/skavex/utils';

/** Where post assets live, and what a `./`-relative image resolves against. */
const POSTS_ROOT = '/src/lib/content/posts';

/**
 * Remark plugin that points post-relative images at `<PostImage />`.
 *
 * A markdown author writes `![alt](./big-o/chart.png)` next to the post. That
 * path means nothing to the browser, and Vite cannot hash or rewrite an asset
 * it never sees referenced, so the image has to reach Vite somehow. PostImage
 * does it with an eager `import.meta.glob` over the whole posts tree, which is
 * why this plugin only has to rewrite the path and not arrange an import.
 *
 * Images that are already absolute or remote are left alone.
 *
 * @returns {(tree: import('mdast').Root) => void}
 */
export function remarkBlogAssets() {
	return (tree) => {
		visit(tree, 'image', (node, index, parent) => {
			if (parent === undefined || index === undefined) return;
			if (!node.url.startsWith('./')) return;

			parent.children[index] = /** @type {any} */ (
				componentNode('PostImage', {
					src: node.url.replace('./', `${POSTS_ROOT}/`),
					alt: node.alt || ''
				})
			);
		});
	};
}
