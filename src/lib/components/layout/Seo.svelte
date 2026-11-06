<script lang="ts">
  import { page } from "$app/state";
  import type { Pathname } from "$app/types";
  import {
    DEFAULT_IMAGE,
    ROUTES,
    jsonLdTag,
    type PageMeta,
    type PageRouteId,
  } from "$lib/data/seo";
  import { SITE_TITLE, SITE_URL } from "$lib/utils/consts";

  // Only page routes reach the layout; endpoints never render it.
  const route = $derived(page.error ? null : (page.route.id as PageRouteId));

  // `Pathname`, not `resolve()`: resolve gives relative paths when prerendering,
  // and a canonical URL must be absolute. A static route's id is its path.
  const current = $derived.by((): { meta: PageMeta; path: Pathname } | null => {
    if (route === null) return null;
    if (route === "/blogs/[slug]") {
      const { slug, metadata } = page.data;
      return { meta: ROUTES[route](metadata), path: `/blogs/${slug}` };
    }
    return { meta: ROUTES[route], path: route };
  });
</script>

<svelte:head>
  {#if current}
    {@const { meta, path } = current}
    {@const title =
      route === "/" ? meta.title : `${meta.title} — ${SITE_TITLE}`}
    {@const url = `${SITE_URL}${path}`}
    {@const image = meta.image ?? DEFAULT_IMAGE}
    <title>{title}</title>
    <meta name="description" content={meta.description} />
    <link rel="canonical" href={url} />
    <meta property="og:site_name" content={SITE_TITLE} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:type" content={meta.post ? "article" : "website"} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image.url} />
    <meta property="og:image:type" content={image.type} />
    <meta property="og:image:width" content={String(image.width)} />
    <meta property="og:image:height" content={String(image.height)} />
    <meta property="og:image:alt" content={image.alt} />
    {#if meta.post}
      <meta property="article:published_time" content={meta.post.published} />
      {#each meta.post.tags as tag (tag)}
        <meta property="article:tag" content={tag} />
      {/each}
    {/if}
    <!-- JSON-LD can't be a Svelte-rendered script element, so it goes in as markup. -->
    {@html jsonLdTag(meta, url)}
  {/if}
</svelte:head>
