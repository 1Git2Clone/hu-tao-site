export interface PostMetadata {
  title: string;
  summary: string;
  date: Date;
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
}

export const postKey = (path: Paths<Post>): string => path;

export const POST_SEARCH_FZF: boolean = true;
