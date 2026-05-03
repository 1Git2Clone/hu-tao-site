/**
 * @param {string} text - Input string
 * @returns {string} Slugified string
 */
export function slugify(text) {
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

/**
 * Ensures a Svelte component import exists in the mdsvex AST.
 *
 * @param {import('unist').Node & { children: any[] }} tree - mdsvex AST root
 * @param {Object} options
 * @param {string} options.importName - Component name (e.g. "YouTube")
 * @param {string} options.importPath - Import path (e.g. "$lib/components/YouTube.svelte")
 */
export function ensureComponentImport(tree, { importName, importPath }) {
	const importLine = `import ${importName} from '${importPath}';`;

	const scriptNodes = tree.children.filter(
		(node) => node.type === 'html' && node.value.trim().startsWith('<script')
	);

	let combinedContent = '';

	for (const node of scriptNodes) {
		let content = node.value.replace('<script>', '').replace('</script>', '').trim();

		// Remove the target import if it exists.
		// Why? Because it could be commented out.
		const importRegex = new RegExp(
			`(^|\\n)\\s*//?\\s*import\\s+${importName}\\s+from\\s+['"].*?['"];?`,
			'g'
		);
		content = content.replace(importRegex, '').trim();

		combinedContent += content + '\n';
	}

	combinedContent = `${importLine}\n` + combinedContent;

	tree.children = tree.children.filter((node) => !scriptNodes.includes(node));

	tree.children.unshift({
		type: 'html',
		value: `<script>\n${combinedContent}</script>`
	});
}

/**
 * Returns the URL if a paragraph contains a single bare/autolink.
 * Otherwise returns null.
 *
 * @param {import('unist').Node} node - paragraph node
 * @returns {string|null}
 */
export function getBareLinkFromParagraph(node) {
	if (!node || node.type !== 'paragraph') return null;
	if (!node.children || node.children.length !== 1) return null;

	const child = node.children[0];

	if (
		child.type === 'link' &&
		child.children.length === 1 &&
		child.children[0].type === 'text' &&
		child.children[0].value.trim() === child.url.trim()
	) {
		return child.url;
	}

	return null;
}
