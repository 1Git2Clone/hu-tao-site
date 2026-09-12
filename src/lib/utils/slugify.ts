/**
 * Turn heading text into a URL fragment.
 *
 * This is the site's URL contract. Every anchor anyone has shared into a post
 * was produced by exactly this function — it came across verbatim from skavex
 * 0.2.0, which used to own it — so changing a character of it silently breaks
 * links that are already in the wild.
 *
 * `rehype-slug` is the ecosystem's answer and is the better slugger, but it is
 * a different one: `### $O(\log n)$ - Logarithmic Complexity` becomes
 * `olog-n-logarithmic-complexity` here and `olog-n---logarithmic-complexity`
 * there, because this collapses the hyphen run and github-slugger does not.
 * Measured against the posts as they stand, 5 of 17 anchors move — every
 * heading whose title contains a formula. That is the whole reason this exists
 * rather than a dependency.
 *
 * It has to stay a single definition because it is called from both ends of the
 * build: `plugins/rehype/headings.js` assigns every heading's `id` while the
 * document is compiling, and the table of contents, the post title and the
 * about-me project links build their `href` with it at render time. Two copies
 * would have to agree forever. They would not.
 *
 * The `<.../>` and `{...}` clauses strip component markup and expressions that
 * survived into the text, so a heading containing either still slugifies to
 * something stable.
 *
 * @param text Heading or title text, already flattened.
 * @returns A lowercase, hyphenated fragment with no unsafe characters.
 */
export function slugify(text: string): string {
	return String(text)
		.replace(/<[^>]*\/>/g, '')
		.replace(/\{[^}]*\}/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');
}
