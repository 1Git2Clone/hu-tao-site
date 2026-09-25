import { error } from '@sveltejs/kit';
import { loadSnippets } from '$lib/utils/snippets';
import type { PageServerLoad } from './$types';
import { isPublished, type PostModule } from '$lib/data/posts';
import { BLOG_ITEMS_EXTENSION } from '$lib/utils/consts';
import { relatedPosts } from '$lib/data/related';
import { POSTS } from '$lib/server/posts';

const posts = import.meta.glob<PostModule>('/src/lib/content/posts/*.md', { eager: true });

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.replace(`.${BLOG_ITEMS_EXTENSION}`, '');
	const key = `/src/lib/content/posts/${slug}.${BLOG_ITEMS_EXTENSION}`;

	const postModule = posts[key] as PostModule;
	if (!postModule || !isPublished(slug)) error(404, `Blog post not found: ${params.slug}`);

	const snippets = loadSnippets(postModule);

	// Only what a card shows; the full metadata of every related post stays on the server.
	const related = relatedPosts({ slug, metadata: postModule.metadata }, POSTS).map(
		({ slug, metadata: { title, date, readingTime } }) => ({ slug, title, date, readingTime })
	);

	return {
		metadata: postModule.metadata,
		snippets,
		related
	};
};
