import type { PageServerLoad } from './$types';
import fs from 'node:fs';
import path from 'node:path';

const posts = import.meta.glob('/src/lib/content/posts/*.svx', { eager: true });

interface Snippet {
  file: string;
  lang: string;
  label: string;
  content: string;
}

export const load: PageServerLoad = async ({ params }) => {
  const slug = params.slug.replace(/\.svx$/, '');
  const key = `/src/lib/content/posts/${slug}.svx`;
  const post = posts[key] as any;

  if (!post) throw new Error(`Post not found: ${params.slug}`);

  const snippets: Snippet[] = (post.metadata?.snippets || []).map((s: any) => {
    try {
      const filePath = path.resolve('src', 'lib', 'snippets', s.file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return { ...s, content };
    } catch (e) {
      return { ...s, content: `Error loading ${s.file}...` };
    }
  });

  return { snippets };
};
