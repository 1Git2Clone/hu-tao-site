<script lang="ts">
  let { src, alt = "" } = $props<{ src: string; alt?: string }>();

  // Vite only hashes and rewrites an asset it can see referenced at build time,
  // and a `src` attribute filled in at runtime is invisible to it. Globbing the
  // post assets eagerly gives Vite that reference for every image at once, so
  // `remarkBlogAssets` can pass a plain path instead of arranging an import per
  // image. `?url` keeps the payload to strings, not the files themselves.
  const assets = import.meta.glob(
    "/src/lib/content/posts/**/*.{png,jpg,jpeg,gif,svg,webp,avif}",
    {
      eager: true,
      query: "?url",
      import: "default",
    },
  ) as Record<string, string>;

  const resolved = $derived(assets[src]);
</script>

{#if resolved}
  <img src={resolved} {alt} loading="lazy" decoding="async" />
{:else}
  <!-- Loud on purpose: a typo'd path would otherwise ship a blank space. -->
  <span class="text-accent">Missing image: {src}</span>
{/if}
