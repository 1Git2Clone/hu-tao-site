import type { PageLoad } from "./$types";
import type { PostModule } from "$lib/data/posts";
import { BLOG_ITEMS_EXTENSION } from "$lib/utils/consts";

const posts = import.meta.glob<PostModule>("/src/lib/content/posts/*.md");

export const load: PageLoad = async ({ params, data }) => {
  const slug = params.slug.replace(`.${BLOG_ITEMS_EXTENSION}`, "");
  const key = `/src/lib/content/posts/${slug}.${BLOG_ITEMS_EXTENSION}`;

  const postModule = await posts[key]();

  if (!postModule) throw new Error(`Post not found: ${params.slug}`);

  return {
    ...data,
    headings: postModule.metadata.headings,
    component: postModule.default,
  };
};
