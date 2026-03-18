import type { Post } from '$lib/data/posts';
import type { Snippet } from '$lib/types/snippets';
import type { PageServerLoad } from './$types';
import fs from 'node:fs';
import path from 'node:path';

const posts = import.meta.glob('/src/lib/content/posts/*.svx', { eager: true });

export const load: PageServerLoad = async ({ params }) => {
  const slug = params.slug.replace(/\.svx$/, '');
  const key = `/src/lib/content/posts/${slug}.svx`;
  const post = posts[key] as Post;

  if (!post) throw new Error(`Post not found: ${params.slug}`);

  const snippets: Snippet[] = (post.metadata?.snippets || []).map((s: Snippet) => {
    try {
      const filePath = path.resolve('src', 'lib', 'snippets', s.file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return { ...s, content };
    } catch (e: unknown) {
      console.error(e);
      return { ...s, content: `Error loading ${s.file}...` };
    }
  });

  return { snippets };
};
