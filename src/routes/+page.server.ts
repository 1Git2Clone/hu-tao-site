import fs from 'node:fs';
import path from 'node:path';
import type { SnippetPath } from '$lib/types/snippets.d.ts';

interface Snippet {
  content: string;
  language: string;
}

type Snippets = Record<SnippetPath, Snippet>;

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

const getFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFiles(res) : res;
  });
  return files;
};

export const load = async () => {
  const snippetsDir = path.resolve('src/lib/snippets');
  const snippets: Snippets = {} as Snippets;

  if (!fs.existsSync(snippetsDir)) {
    return { snippets: {} as Snippets };
  }

  const allFiles = getFiles(snippetsDir);

  for (const filePath of allFiles) {
    const relativePath = path.relative(snippetsDir, filePath) as SnippetPath;
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    snippets[relativePath] = {
      content,
      language: languageMap[ext] ?? 'text'
    };
  }


  return {
    snippets
  };
};
