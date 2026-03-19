import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import type { Snippet } from '$lib/types/snippets';
import type { PostModule } from '$lib/data/posts';

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
  const snippetFiles = glob.sync('src/lib/snippets/**/*.*');
  const snippets: Record<string, Snippet> = {};

  for (const filePath of snippetFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativeFile = path.relative('src/lib/snippets', filePath).replace(/\\/g, '/');

    const meta = post?.metadata?.snippets?.find(s => s.file === relativeFile);

    snippets[relativeFile] = {
      file: relativeFile,
      lang: meta?.lang || languageMap[path.extname(filePath)] || 'text',
      label: meta?.label || relativeFile,
      content
    };
  }

  return snippets;
};
