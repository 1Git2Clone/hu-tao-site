import fs from 'node:fs';
import path from 'node:path';

export const load = async () => {
  const filePath = path.resolve('src/lib/snippets/example.py');
  const content = fs.readFileSync(filePath, 'utf-8');

  return {
    snippet: content,
    language: 'rust',
  };
};
