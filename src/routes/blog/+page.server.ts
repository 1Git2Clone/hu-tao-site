import type { Load } from '@sveltejs/kit';
import { type Post, type PostModule } from '$lib/data/posts'

export const load: Load = async () => {
  const modules = import.meta.glob<PostModule>('$lib/content/posts/*.svx', { eager: true });

  const posts: Post[] = Object.entries(modules).map(([path, postModule]) => {
    const slug = path.split('/').pop()?.replace(/\.svx$/, '') || '';
    const metadata = postModule.metadata;

    return { slug, metadata };
  });

  return { posts };
};
