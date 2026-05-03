import fs from 'node:fs';
import { globSync } from 'glob';

const files = globSync('src/lib/snippets/**/*.*');
const paths = files.map((f) => f.replace('src/lib/snippets/', ''));

const typeContent = `export type SnippetPath = ${paths.map((p) => `'${p}'`).join(' | ')};`;

fs.writeFileSync('src/lib/types/snippet-paths.d.ts', typeContent);
