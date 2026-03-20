import type { Load } from '@sveltejs/kit';
import { type Post, type PostModule } from '$lib/data/posts'
import { BLOG_ITEMS_EXTENSION } from '$lib/utils/consts';

export const load: Load = async () => {
  const modules = import.meta.glob<PostModule>('$lib/content/posts/*.md', { eager: true });

  const posts: Post[] = Object.entries(modules).map(([path, postModule]) => {
    const slug = path.split('/').pop()?.replace(`.${BLOG_ITEMS_EXTENSION}`, '') || '';
    const metadata = postModule.metadata;

    return { slug, metadata };
  });

  return { posts };
};
