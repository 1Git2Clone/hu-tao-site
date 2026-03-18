import type { PostModule } from '$lib/data/posts';
import type { PageLoad } from './$types';

const posts = import.meta.glob<PostModule>('/src/lib/content/posts/*.svx', { eager: true });

export const load: PageLoad = async ({ data, params }) => {
  const slug = params.slug.replace(/\.svx$/, '');
  const key = `/src/lib/content/posts/${slug}.svx`;

  const post = posts[key];

  if (!post) throw new Error(`Post not found: ${params.slug}`);

  return {
    ...data,
    component: post.default,
    metadata: post.metadata,
    headings: post.metadata.headings || []
  };
};
