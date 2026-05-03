import { error } from '@sveltejs/kit';
import { loadSnippets } from '$lib/utils/snippets';
import type { PageServerLoad } from './$types';
import type { PostModule } from '$lib/data/posts';
import { BLOG_ITEMS_EXTENSION } from '$lib/utils/consts';

const posts = import.meta.glob<PostModule>('/src/lib/content/posts/*.md', { eager: true });

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.replace(`.${BLOG_ITEMS_EXTENSION}`, '');
	const key = `/src/lib/content/posts/${slug}.${BLOG_ITEMS_EXTENSION}`;

	const postModule = posts[key] as PostModule;
	if (!postModule) error(404, `Blog post not found: ${params.slug}`);

	const snippets = loadSnippets(postModule);

	return {
		metadata: postModule.metadata,
		snippets
	};
};
