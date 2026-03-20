import { visit } from 'unist-util-visit';
import { createHighlighter } from 'shiki';
import { ensureComponentImport } from '../utils.js';

const THEME = 'rose-pine-moon'

const languageMap = {
  '.rs': 'rust',
  '.py': 'python',
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
  '.html': 'html',
  '.css': 'css',
  '.json': 'json',
  '.md': 'markdown',
  '.sh': 'bash',
  '.rb': 'ruby',
  '.go': 'go',
  '.php': 'php',
  '.r': 'r',
  '.c': 'c',
  '.cpp': 'cpp',
  '.cs': 'csharp',
  '.java': 'java',
  '.kt': 'kotlin',
  '.sql': 'sql',
  'c#': 'csharp',
  'c++': 'cpp',
};

const highlighter = await createHighlighter({
  themes: [THEME],
  langs: [
    'rust', 'python', 'javascript', 'typescript', 'jsx', 'tsx',
    'html', 'css', 'json', 'markdown', 'bash', 'ruby', 'go',
    'php', 'r', 'c', 'cpp', 'csharp', 'java', 'kotlin', 'sql'
  ]
});

/**
 * Remark plugin that transforms markdown code blocks into
 * `<CodeBlock />` Svelte components with precomputed HTML.
 */
export function remarkCodeBlock() {
  return async (tree) => {
    let hasCodeBlock = false;
    const nodesToProcess = [];

    visit(tree, 'code', (node, index, parent) => {
      nodesToProcess.push({ node, index, parent });
    });

    if (nodesToProcess.length === 0) return;

    for (const { node, index, parent } of nodesToProcess) {
      hasCodeBlock = true;

      let lang = node.lang?.toLowerCase() || 'text';

      lang = languageMap[lang] || languageMap[`.${lang}`] || lang;

      const loadedLangs = highlighter.getLoadedLanguages();
      const finalLang = loadedLangs.includes(lang) ? lang : 'text';

      const html = highlighter.codeToHtml(node.value, {
        lang: finalLang,
        theme: THEME,
        transformers: [
          {
            pre(node) {
              const existingStyle = node.properties.style || '';

              const cleanedStyle = existingStyle
                .replace(/padding:[^;]+;?/g, '')
                .replace(/margin:[^;]+;?/g, '')
                .replace(/background-color:[^;]+;?/g, '');



              node.properties.style = `
                ${cleanedStyle};
                padding: 1rem;
                margin: 0;
                background-color: var(--color-code-block);
`.trim();
            }
          }
        ]
      });

      const safeHtml = html
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');

      parent.children[index] = {
        type: 'html',
        value: `<CodeBlock lang="${finalLang}">{@html \`${safeHtml}\`}</CodeBlock>`
      };
    }

    if (hasCodeBlock) {
      ensureComponentImport(tree, {
        importName: 'CodeBlock',
        importPath: '$lib/components/CodeBlock.svelte'
      });
    }
  };
}
