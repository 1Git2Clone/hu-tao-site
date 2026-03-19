import type { Component } from 'svelte';
import type { PageLoad } from './$types';

const posts = import.meta.glob<{ default: Component }>('/src/lib/content/posts/*.svx');

export const load: PageLoad = async ({ params, data }) => {
  const slug = params.slug.replace(/\.svx$/, '');
  const key = `/src/lib/content/posts/${slug}.svx`;

  const postModule = await posts[key]();

  if (!postModule) throw new Error(`Post not found: ${params.slug}`);

  return {
    ...data,
    component: postModule.default
  };
};
