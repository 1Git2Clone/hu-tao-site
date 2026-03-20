import { visit } from 'unist-util-visit';
import { ensureComponentImport } from '../utils.js';

const languageMap = {
  '.rs': 'rust',
  '.py': 'python',
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
  '.html': 'markup',
  '.css': 'css',
  '.json': 'json',
  '.md': 'markdown',
  '.sh': 'bash'
};

/**
 * Remark plugin that transforms markdown code blocks into
 * `<CodeBlock />` Svelte components.
 *
 * @returns {(tree: import('unist').Node) => void}
 */
export function remarkCodeBlock() {
  return (tree) => {
    let hasCodeBlock = false;

    visit(tree, 'code', (node, index, parent) => {
      hasCodeBlock = true;

      let lang = node.lang || 'text';
      lang = languageMap[lang] || languageMap[`.${lang}`] || lang;

      const safeContent = node.value
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');

      parent.children[index] = {
        type: 'html',
        value: `<CodeBlock lang="${lang}">{\`${safeContent}\`}</CodeBlock>`
      };
    });

    if (!hasCodeBlock) return;

    ensureComponentImport(tree, {
      importName: 'CodeBlock',
      importPath: '$lib/components/CodeBlock.svelte'
    });
  };
}
