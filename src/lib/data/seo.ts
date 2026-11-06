import type { RouteId } from "$app/types";
import type { PostMetadata } from "./posts";
import {
  EMAIL,
  GITHUB_PROFILE_NAME,
  SITE_TITLE,
  SITE_URL,
  TWITTER_PROFILE_HANDLE,
} from "../utils/consts.ts";

/** Routes that render a page. Endpoints serve no HTML, so they get no meta. */
export type PageRouteId = Exclude<
  RouteId,
  "/blog" | "/blog/[...slug]" | "/sitemap.xml"
>;

export type OgImage = {
  url: string;
  type: "image/jpeg" | "image/png" | "image/webp";
  width: number;
  height: number;
  alt: string;
};

export type PageMeta = {
  /** Without the site name; `<Seo>` appends it everywhere but the home page. */
  title: string;
  description: string;
  /** schema.org type of the page itself. */
  schema: "ProfilePage" | "CollectionPage" | "WebPage" | "BlogPosting";
  image?: OgImage;
  /** `published` is a `YYYY-MM-DD` date. */
  post?: { published: string; tags: PostMetadata["tags"] };
};

/** A dynamic route's meta comes from the page it renders. */
type RouteMeta<R extends PageRouteId> = R extends "/blogs/[slug]"
  ? (post: PostMetadata) => PageMeta
  : PageMeta;

export const DEFAULT_IMAGE: OgImage = {
  url: `${SITE_URL}/og-image.jpg`,
  type: "image/jpeg",
  width: 1280,
  height: 1280,
  alt: "1Git2Clone's portfolio page icon",
};

// Every page route needs an entry: a new route without one, or an entry for a
// route that no longer exists, fails `svelte-check`.
export const ROUTES: { [R in PageRouteId]: RouteMeta<R> } = {
  "/": {
    title: SITE_TITLE,
    description:
      'A dev with the horrible habit of "doing it myself". A NixOS-described VPS, Rust side projects, and AI integration by day.',
    schema: "ProfilePage",
  },
  "/blogs": {
    title: "Blogs",
    description: "Posts on data structures, algorithms and computer science.",
    schema: "CollectionPage",
  },
  "/blogs/[slug]": (post) => ({
    title: post.title,
    description: post.summary,
    schema: "BlogPosting",
    post: { published: publishedDate(post.date), tags: post.tags },
  }),
  "/infra": {
    title: "Infrastructure",
    description:
      "A self-hosted VPS described entirely in one NixOS flake: git hosting, CI, status, search, observability, and backups.",
    schema: "WebPage",
  },
  "/journey": {
    title: "Linux Journey",
    description:
      "My journey into the Linux world — from first install to current setup.",
    schema: "WebPage",
  },
};

// Frontmatter dates arrive as strings ("March 17 2026"), whatever the type says.
// Parsed and formatted both in local time, so the day never shifts with the
// build machine's timezone the way `toISOString()` would shift it.
function publishedDate(date: PostMetadata["date"]): string {
  return new Date(date).toLocaleDateString("sv-SE");
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOURCE_ID = `${SITE_URL}/#source`;

/** The schema.org graph for one page: who, which site, its source, the page. */
export function jsonLd(meta: PageMeta, url: string) {
  const image = meta.image ?? DEFAULT_IMAGE;
  const page = {
    "@type": meta.schema,
    "@id": url,
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": WEBSITE_ID },
    ...(meta.schema === "ProfilePage" && { mainEntity: { "@id": PERSON_ID } }),
    ...(meta.post && {
      headline: meta.title,
      datePublished: meta.post.published,
      keywords: meta.post.tags,
      author: { "@id": PERSON_ID },
      image: image.url,
    }),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Ivan",
        alternateName: GITHUB_PROFILE_NAME,
        url: `${SITE_URL}/`,
        email: `mailto:${EMAIL}`,
        sameAs: [
          `https://github.com/${GITHUB_PROFILE_NAME}`,
          "https://git.hu-tao.dev/hutao",
          `https://twitter.com/${TWITTER_PROFILE_HANDLE.replace("@", "")}`,
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_TITLE,
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        isBasedOn: { "@id": SOURCE_ID },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": SOURCE_ID,
        name: "hu-tao-site",
        codeRepository: `https://github.com/${GITHUB_PROFILE_NAME}/hu-tao-site`,
        programmingLanguage: ["TypeScript", "Svelte"],
        author: { "@id": PERSON_ID },
      },
      page,
    ],
  };
}

/**
 * `jsonLd()` as a ready `<script>` tag for `{@html}`. Lives here, not in the
 * component, because a literal script tag in Svelte markup reads as a script
 * block to the linter. `<` is escaped so no string in it can close the tag.
 */
export function jsonLdTag(meta: PageMeta, url: string): string {
  const json = JSON.stringify(jsonLd(meta, url)).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}
