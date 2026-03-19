import { loadSnippets } from '$lib/utils/snippets';
import type { PageServerLoad } from './$types';
import type { PostModule } from '$lib/data/posts';

const posts = import.meta.glob<PostModule>('/src/lib/content/posts/*.svx', { eager: true });

export const load: PageServerLoad = async ({ params }) => {
  const slug = params.slug.replace(/\.svx$/, '');
  const key = `/src/lib/content/posts/${slug}.svx`;

  const postModule = posts[key] as PostModule;
  if (!postModule) throw new Error(`Post not found: ${params.slug}`);

  const snippets = loadSnippets(postModule);

  return {
    metadata: postModule.metadata,
    snippets
  };
};
