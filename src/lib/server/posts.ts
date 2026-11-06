import { isPublished, type Post, type PostModule } from "$lib/data/posts";
import { validatePostIds } from "$lib/data/related";
import { BLOG_ITEMS_EXTENSION } from "$lib/utils/consts";

// Server-only: an eager glob of every post would otherwise land in the client bundle.
const modules = import.meta.glob<PostModule>("/src/lib/content/posts/*.md", {
  eager: true,
});

export const POSTS: Post[] = Object.entries(modules)
  .map(([path, postModule]) => ({
    slug: path.split("/").pop()?.replace(`.${BLOG_ITEMS_EXTENSION}`, "") || "",
    metadata: postModule.metadata,
  }))
  .filter(({ slug }) => isPublished(slug));

// Fails the build (and dev) on a missing, duplicate, or dangling post id.
validatePostIds(POSTS);
