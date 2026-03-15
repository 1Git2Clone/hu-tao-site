import type { Load } from '@sveltejs/kit';
import { type Post, type PostMetadata } from '$lib/data/posts'

export const load: Load = async () => {
  const modules = import.meta.glob('$lib/content/posts/*.svx', { eager: true });

  const posts: Post[] = Object.entries(modules).map(([path, postModule]) => {
    const slug = path.split('/').pop()?.replace(/\.svx$/, '')!;
    const metadata = (postModule as any).metadata as PostMetadata;

    return { slug, metadata };
  });

  return { posts };
};
