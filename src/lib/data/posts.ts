import type { Component } from 'svelte';
import type { Snippet } from '$lib/types/snippets';
import type { Paths } from '$lib/utils/type-helpers';

export type PostTags = 'dsa' | 'cs';

export interface Heading {
	id: string;
	html: string;
	level: number;
}

export interface PostMetadata {
	title: string;
	summary: string;
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

export const postKey = (path: Paths<Post>): string => path;

export const POST_SEARCH_FZF: boolean = true;
