import { visit } from 'unist-util-visit';
import { createHash } from 'crypto';
import { ensureComponentImport } from '../utils.js';

export function remarkBlogAssets() {
	return (tree) => {
		visit(tree, 'image', (node) => {
			if (node.url.startsWith('./')) {
				const hash = createHash('sha256').update(node.url).digest('hex').slice(0, 12);
				const readable = node.url
					.replace('./', '')
					.replace(/\.[^/.]+$/, '')
					.replace(/[^a-zA-Z0-9]/g, '_');
				const variableName = readable ? `ASSET_${readable}_${hash}` : `ASSET_${hash}`;
				const assetPath = node.url.replace('./', '$lib/content/posts/');
				ensureComponentImport(tree, {
					importName: variableName,
					importPath: assetPath
				});
				node.type = 'html';
				node.value = `<img src={${variableName}} alt="${node.alt || ''}" loading="lazy" />`;
			}
		});
	};
}
