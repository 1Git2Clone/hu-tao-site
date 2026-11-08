import type { Component } from "svelte";
import type { Snippet } from "$lib/types/snippets";
import type { Paths } from "$lib/utils/type-helpers";
import type { OgImage } from "./seo";

export type PostTags = "dsa" | "cs";

export interface Heading {
  id: string;
  html: string;
  level: number;
}

export interface PostMetadata {
  /** Mandatory, unique UUIDv7 (`pnpm compute-blog-id <post.md>`). */
  id: string;
  /** Ids of hand-picked related posts; overrides the tag-based ranking. */
  related?: string[];
  title: string;
  summary: string;
  /** Article-specific preview; relative URLs resolve against the site origin. */
  image?: OgImage;
  date: Date;
  tags: Array<PostTags>;
  snippets: Snippet[];
  // remarks:
  headings: Heading[];
  readingTime: string;
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
}

export interface PostModule {
  default: Component;
  metadata: PostMetadata;
}

/** `test-*` posts are fixtures: listed and routable in dev only. */
export const isPublished = (slug: string): boolean =>
  import.meta.env.DEV || !slug.startsWith("test-");

export const postKey = (path: Paths<Post>): string => path;

export const POST_SEARCH_FZF: boolean = true;
