import type { RequestHandler } from '@sveltejs/kit';
import type { PostModule } from '$lib/data/posts';
import { BLOG_ITEMS_EXTENSION } from '$lib/utils/consts';

export const prerender = true;

const SITE_URL = 'https://1g2c.netlify.app';

const STATIC_ROUTES = ['/', '/blogs', '/about-me', '/journey'];

const posts = import.meta.glob<PostModule>('/src/lib/content/posts/*.md', { eager: true });

function urlEntry(loc: string, lastmod?: string): string {
	return [
		'\t<url>',
		`\t\t<loc>${loc}</loc>`,
		lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
		'\t\t<changefreq>monthly</changefreq>',
		'\t</url>'
	]
		.filter(Boolean)
		.join('\n');
}

export const GET: RequestHandler = () => {
	const staticEntries = STATIC_ROUTES.map((route) => urlEntry(`${SITE_URL}${route}`));

	const postEntries = Object.entries(posts).map(([path, mod]) => {
		const filename = path.split('/').pop() ?? '';
		const slug = filename.endsWith(`.${BLOG_ITEMS_EXTENSION}`)
			? filename.slice(0, -`.${BLOG_ITEMS_EXTENSION}`.length)
			: filename;
		const lastmod = mod.metadata?.date
			? new Date(mod.metadata.date).toISOString().split('T')[0]
			: undefined;
		return urlEntry(`${SITE_URL}/blogs/${slug}`, lastmod);
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
