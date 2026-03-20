import type { Snippet } from '$lib/types/snippets';
import type { PostModule } from '$lib/data/posts';
import path from 'node:path';

const languageMap: Record<string, string> = {
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

export const loadSnippets = (post?: PostModule): Record<string, Snippet> => {
  const modules = import.meta.glob('/src/lib/snippets/**/*.*', { eager: true, query: '?raw' });
  const snippets: Record<string, Snippet> = {};

  for (const key in modules) {
    const relativeFile = path.relative('/src/lib/snippets', key).replace(/\\/g, '/');
    const content = modules[key] as string;

    const meta = post?.metadata?.snippets?.find(s => s.file === relativeFile);

    snippets[relativeFile] = {
      file: relativeFile,
      lang: meta?.lang || languageMap[path.extname(relativeFile)] || 'text',
      label: meta?.label || relativeFile,
      content
    };
  }

  return snippets;
};
