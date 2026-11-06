import type { Load } from "@sveltejs/kit";
import { POSTS } from "$lib/server/posts";

export const load: Load = async () => ({ posts: POSTS });
