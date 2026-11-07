<script lang="ts">
  import Highlight from "$lib/components/Highlight.svelte";
  import Fuse from "fuse.js";
  import { POST_SEARCH_FZF, postKey } from "$lib/data/posts";
  import { resolve } from "$app/paths";
  import Card from "$lib/components/layout/Card.svelte";
  import Term from "$lib/components/layout/Term.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { SvelteURLSearchParams } from "svelte/reactivity";
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { flip } from "svelte/animate";
  import { prefersReducedMotion } from "svelte/motion";
  import { scale } from "svelte/transition";
  import { onDestroy } from "svelte";

  let { data } = $props();
  let searchQuery = $state(page.url.searchParams.get("q") || "");
  let searchInput: HTMLInputElement | undefined = $state();
  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  let writtenQuery: string | undefined;

  beforeNavigate(({ to }) => {
    // Leaving can delay destruction beyond the debounce interval.
    if (to?.url.pathname !== page.url.pathname) {
      clearTimeout(searchTimer);
      writtenQuery = undefined;
    }
  });

  const itemsPerPage = 10;
  const currentPage = $derived.by(() => {
    const value =
      searchQuery === (page.url.searchParams.get("q") || "")
        ? page.url.searchParams.get("page") || "1"
        : "1";
    const requested = /^\d+$/.test(value) ? Number(value) : 1;
    const lastPage = Math.max(1, Math.ceil(allResults.length / itemsPerPage));
    return Number.isSafeInteger(requested)
      ? Math.max(1, Math.min(requested, lastPage))
      : 1;
  });

  const fuse = $derived(
    new Fuse(data.posts, {
      keys: [
        { name: postKey("metadata.title"), weight: 1 },
        { name: postKey("metadata.summary"), weight: 0.5 },
        { name: postKey("metadata.tags"), weight: 0.4 },
        { name: postKey("slug"), weight: 0.3 },
      ],
      threshold: 0.4,
      includeMatches: POST_SEARCH_FZF,
    }),
  );

  let allResults = $derived(
    searchQuery.trim().length > 0
      ? fuse.search(searchQuery.trim())
      : data.posts.map((p) => ({ item: p, matches: [] })),
  );

  let showCount = $derived(
    searchQuery.trim().length > 0 && allResults.length > 0,
  );

  let searchDisplay = $derived(
    allResults.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ),
  );

  function handleKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.code === "Escape") {
      e.preventDefault();
      searchInput?.blur();
    }
  }

  $effect(() => {
    // URL changes include pagination and browser history. Only input events
    // write a query, so mounting or returning never rewrites a valid URL.
    const query = page.url.searchParams.get("q") || "";
    if (query === writtenQuery) {
      // This write can land after another keypress. Keep the newer draft
      // and its pending timer; consume ownership before a later history move.
      writtenQuery = undefined;
      return;
    }
    writtenQuery = undefined;
    searchQuery = query;
    clearTimeout(searchTimer);
  });

  function search(event: Event & { currentTarget: HTMLInputElement }) {
    searchQuery = event.currentTarget.value;
    clearTimeout(searchTimer);
    const query = searchQuery;
    searchTimer = setTimeout(() => {
      const params = new SvelteURLSearchParams(page.url.searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      writtenQuery = query;
      const finished = () => {
        if (writtenQuery === query) writtenQuery = undefined;
      };
      void goto(resolve(`/blogs?${params.toString()}`), {
        replaceState: true,
        noScroll: true,
        keepFocus: true,
      }).then(finished, finished);
    }, 300);
  }

  onDestroy(() => clearTimeout(searchTimer));
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="mx-auto grid h-full w-full max-w-4xl grid-cols-1 gap-2 space-y-8"
  style="grid-template-rows: auto auto 1fr auto;"
>
  <Term
    label="Blogs"
    level={1}
    id="title"
    path="~/blogs"
    cmd="ls"
    cursor
    hero
    class="row-start-1"
    bodyClass="flex flex-col items-center px-4 pt-4 pb-6 sm:px-8"
  >
    <div
      class="flex w-full max-w-md items-center gap-2 border border-frame px-2 py-1 transition-shadow focus-within:ring-2 focus-within:ring-primary"
    >
      <span
        class="text-muted-foreground flex size-10 items-center justify-center text-xl leading-none"
        style="transform: translateX(-2px);"
      >
        
      </span>
      <input
        bind:this={searchInput}
        type="text"
        value={searchQuery}
        oninput={search}
        placeholder="Search posts..."
        class="placeholder:text-muted-foreground w-full border-0 bg-transparent ring-0 outline-none focus:border-0 focus:ring-0 focus:outline-none"
      />
      <kbd
        class="hidden h-8 w-16 items-center justify-around gap-2 rounded bg-muted px-2 text-lg opacity-100 md:inline-flex"
      >
        <span class=""> ⌘ </span> K
      </kbd>
    </div>
    <!-- The count's row grows from 0fr while a search has results, so the
         box opens smoothly. The gap is padding on the inner <p>: on the
         clipped element, padding or margin would keep the closed row 1rem
         tall. -->
    <div
      class={[
        "grid transition-[grid-template-rows] duration-300 ease-[ease] motion-reduce:transition-none",
        showCount ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      ]}
    >
      <div class="min-h-0 overflow-hidden">
        <p id="search-results" class="pt-4">
          {#if showCount}
            {allResults.length}/{data.posts.length} results for search: "<b
              >{searchQuery.trim()}</b
            >".
          {/if}
        </p>
      </div>
    </div>
  </Term>

  <section class="row-start-2 grid gap-6 md:grid-cols-2">
    {#each searchDisplay as result (result.item.slug)}
      {@const post = result.item}
      {@const duration = prefersReducedMotion.current ? 0 : 150}
      <!-- A card that a search drops fades out where it was: with animate:,
           Svelte takes it out of the flow during the outro, so the others
           slide into place at the same time. -->
      <div animate:flip={{ duration }} out:scale={{ duration, start: 0.95 }}>
        <Card>
          <h2 class="text-xl font-semibold">
            <a
              class="text-xl underline hover:text-textcol"
              href={resolve(`/blogs/${post.slug}`)}
            >
              <Highlight
                text={post.metadata.title}
                matches={result.matches}
                path={postKey("metadata.title")}
              />
            </a>
          </h2>
          <div class="flex flex-wrap gap-4 text-sm text-subtextcol">
            {#if post.metadata.date}
              <span>{post.metadata.date}</span>
            {/if}
            {#if post.metadata.readingTime}
              <span>{post.metadata.readingTime}</span>
            {/if}
          </div>
          <p class="text-muted-foreground mt-2">
            <Highlight
              text={post.metadata.summary}
              matches={result.matches}
              path={postKey("metadata.summary")}
            />
          </p>
          {#if post.metadata.tags}
            <span class="text-sm text-subtextcol">
              <b>Tags</b>:

              <Highlight
                text={post.metadata.tags.join(", ")}
                matches={result.matches}
                path={postKey("metadata.tags")}
              />
            </span>
          {/if}
        </Card>
      </div>
    {:else}
      <div class="text-muted-foreground col-span-full py-10 text-center">
        No posts found matching "{searchQuery}"
      </div>
    {/each}
  </section>

  <div class="row-start-3"></div>

  <div class="row-start-4">
    <Pagination
      {currentPage}
      totalItems={allResults.length}
      {itemsPerPage}
      query={searchQuery}
    />
  </div>
</div>
