import type { PageLoad } from './$types';
import type { PostModule } from '$lib/data/posts';

const posts = import.meta.glob<PostModule>('/src/lib/content/posts/*.svx');

export const load: PageLoad = async ({ params, data }) => {
  const slug = params.slug.replace(/\.svx$/, '');
  const key = `/src/lib/content/posts/${slug}.svx`;

  const postModule = await posts[key]();

  if (!postModule) throw new Error(`Post not found: ${params.slug}`);

  return {
    ...data,
    headings: postModule.metadata.headings,
    component: postModule.default
  };
};
