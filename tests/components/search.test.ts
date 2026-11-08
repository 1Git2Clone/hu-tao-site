import { beforeEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";
import { SvelteURL } from "svelte/reactivity";
import Blogs from "../../src/routes/blogs/+page.svelte";
import { page } from "./app-state.svelte";
import {
  navigations,
  navigationOptions,
  pendingNavigations,
  setDeferred,
  beforeNavigations,
} from "./navigation";
import type { Post } from "$lib/data/posts";
import "../../src/routes/layout.css";

const posts: Post[] = Array.from({ length: 25 }, (_, i) => ({
  slug: `post-${i + 1}`,
  metadata: {
    id: String(i),
    title: `Post ${i + 1}`,
    summary: i < 12 ? "alpha" : "omega",
    tags: ["cs"],
    date: new Date("2026-01-01"),
    snippets: [],
    headings: [],
    readingTime: "1 min",
  },
}));

beforeEach(() => {
  page.url = new SvelteURL("http://localhost/blogs?page=2");
  navigations.length = 0;
  navigationOptions.length = 0;
  setDeferred(false);
  pendingNavigations.length = 0;
  beforeNavigations.length = 0;
});

test("initial page survives mount, pagination and history keep the query in sync", async () => {
  const screen = await render(Blogs, { data: { posts } });
  await expect.element(screen.getByText("Page 2 of 3")).toBeVisible();
  expect(navigations).toHaveLength(0);
  await screen.getByRole("button", { name: "Next" }).click();
  await expect.element(screen.getByText("Page 3 of 3")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Next" }))
    .toBeDisabled();
  page.url = new SvelteURL("http://localhost/blogs?q=alpha&page=2");
  await expect
    .element(screen.getByPlaceholder("Search posts..."))
    .toHaveValue("alpha");
  await expect.element(screen.getByText("Page 2 of 2")).toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Post 11", exact: true }))
    .toBeVisible();
  page.url = new SvelteURL("http://localhost/blogs?page=3");
  await expect
    .element(screen.getByPlaceholder("Search posts..."))
    .toHaveValue("");
  await expect.element(screen.getByText("Page 3 of 3")).toBeVisible();
});

test("typing resets the page once, debounces the URL, and unmount cancels pending writes", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  try {
    const screen = await render(Blogs, { data: { posts } });
    const input = screen
      .getByPlaceholder("Search posts...")
      .element() as HTMLInputElement;
    function type(value: string) {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    type("ome");
    await tick();
    expect(screen.container.textContent).toContain("Page 1 of 2");
    await vi.advanceTimersByTimeAsync(299);
    expect(navigations).toHaveLength(0);
    type("omega");
    await tick();
    await vi.advanceTimersByTimeAsync(300);
    expect(navigations).toHaveLength(1);
    expect(navigationOptions[0]).toEqual({
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
    expect(page.url.searchParams.get("q")).toBe("omega");
    expect(page.url.searchParams.get("page")).toBe("1");
    type("pending");
    await tick();
    await screen.unmount();
    await vi.advanceTimersByTimeAsync(300);
    expect(navigations).toHaveLength(1);
  } finally {
    vi.useRealTimers();
  }
});

test("an earlier URL write cannot replace a newer draft or cancel its timer", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  setDeferred(true);
  try {
    const screen = await render(Blogs, { data: { posts } });
    const input = screen
      .getByPlaceholder("Search posts...")
      .element() as HTMLInputElement;
    const type = async (value: string) => {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await tick();
    };
    await type("ome");
    await vi.advanceTimersByTimeAsync(300);
    expect(pendingNavigations).toHaveLength(1);
    await type("omega");
    pendingNavigations.shift()!.complete();
    await vi.advanceTimersByTimeAsync(0);
    expect(input.value).toBe("omega");
    await vi.advanceTimersByTimeAsync(300);
    expect(navigations).toHaveLength(2);
    expect(navigations[1]).toContain("q=omega");
    pendingNavigations.shift()!.complete();
    await vi.advanceTimersByTimeAsync(0);
    page.url = new SvelteURL("http://localhost/blogs?q=ome");
    await tick();
    expect(input.value).toBe("ome");
    await screen.unmount();
  } finally {
    setDeferred(false);
    vi.useRealTimers();
  }
});

test("an aborted URL write releases ownership before browser history restores that query", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  setDeferred(true);
  try {
    const screen = await render(Blogs, { data: { posts } });
    const input = screen
      .getByPlaceholder("Search posts...")
      .element() as HTMLInputElement;
    input.value = "ome";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    await vi.advanceTimersByTimeAsync(300);
    pendingNavigations.shift()!.abort();
    await vi.advanceTimersByTimeAsync(0);
    input.value = "omega";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    page.url = new SvelteURL("http://localhost/blogs?q=ome");
    await tick();
    expect(input.value).toBe("ome");
    await vi.advanceTimersByTimeAsync(300);
    expect(navigations).toHaveLength(1);
    await screen.unmount();
  } finally {
    setDeferred(false);
    vi.useRealTimers();
  }
});

test("leaving the page cancels a draft before delayed component destruction", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  try {
    const screen = await render(Blogs, { data: { posts } });
    const input = screen
      .getByPlaceholder("Search posts...")
      .element() as HTMLInputElement;
    input.value = "pending";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    for (const callback of beforeNavigations)
      callback({
        to: { url: new URL("http://localhost/infra") },
        complete: new Promise(() => {}),
      });
    await vi.advanceTimersByTimeAsync(300);
    expect(navigations).toHaveLength(0);
    await screen.unmount();
  } finally {
    vi.useRealTimers();
  }
});

test("a cancelled departure restores the pending search URL write", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  try {
    const screen = await render(Blogs, { data: { posts } });
    const input = screen
      .getByPlaceholder("Search posts...")
      .element() as HTMLInputElement;
    input.value = "omega";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    const complete = Promise.withResolvers<void>();
    for (const callback of beforeNavigations)
      callback({
        to: { url: new URL("http://localhost/infra") },
        complete: complete.promise,
      });
    await vi.advanceTimersByTimeAsync(300);
    expect(navigations).toHaveLength(0);
    complete.reject(new Error("Navigation cancelled"));
    await vi.advanceTimersByTimeAsync(300);
    expect(page.url.searchParams.get("q")).toBe("omega");
    expect(navigations).toHaveLength(1);
    await screen.unmount();
  } finally {
    vi.useRealTimers();
  }
});

test("an external departure preserves the draft even if the browser stops loading", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  try {
    const screen = await render(Blogs, { data: { posts } });
    const input = screen
      .getByPlaceholder("Search posts...")
      .element() as HTMLInputElement;
    input.value = "omega";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    for (const callback of beforeNavigations)
      callback({
        to: { url: new URL("https://example.com/") },
        willUnload: true,
        complete: new Promise(() => {}),
      });
    await vi.advanceTimersByTimeAsync(300);
    expect(page.url.searchParams.get("q")).toBe("omega");
    expect(input.value).toBe("omega");
    expect(navigations).toHaveLength(0);
    await screen.unmount();
  } finally {
    vi.useRealTimers();
  }
});

test("invalid pages and empty results never produce an empty slice of existing results", async () => {
  const screen = await render(Blogs, { data: { posts } });
  for (const value of ["bad", "2x", "0", "-1", "99999999999999999"]) {
    page.url = new SvelteURL(`http://localhost/blogs?page=${value}`);
    await expect.element(screen.getByText("Page 1 of 3")).toBeVisible();
  }
  page.url = new SvelteURL("http://localhost/blogs?page=99");
  await expect.element(screen.getByText("Page 3 of 3")).toBeVisible();
  page.url = new SvelteURL("http://localhost/blogs?q=zzzzzznomatch&page=99");
  await expect.element(screen.getByText(/No posts found/)).toBeVisible();
  expect(
    screen.getByRole("navigation", { name: "Pagination" }).query(),
  ).toBeNull();
});

test("search reorders retained cards and removes outgoing cards without stale layout", async () => {
  page.url = new SvelteURL("http://localhost/blogs");
  const screen = await render(Blogs, { data: { posts: posts.slice(0, 6) } });
  const input = screen.getByPlaceholder("Search posts...");
  const titles = () =>
    Array.from(screen.container.querySelectorAll("h2"), (heading) =>
      heading.textContent?.trim(),
    );
  expect(titles()).toEqual([
    "Post 1",
    "Post 2",
    "Post 3",
    "Post 4",
    "Post 5",
    "Post 6",
  ]);
  const top = screen.container
    .querySelector("section.row-start-2")!
    .getBoundingClientRect().top;
  const rects = () =>
    Array.from(
      screen.container.querySelectorAll("section.row-start-2 > div"),
      (card) => {
        const { x, y, width, height } = card.getBoundingClientRect();
        return [x, y, width, height];
      },
    );
  const initialRects = rects();
  await input.fill("Post 5");
  await expect.poll(() => titles()[0]).toBe("Post 5");
  await input.fill("zzzznomatch");
  await expect.poll(() => titles()).toEqual([]);
  await input.fill("");
  await expect
    .poll(titles)
    .toEqual(["Post 1", "Post 2", "Post 3", "Post 4", "Post 5", "Post 6"]);
  // Wait for the count row to collapse and FLIP/outro animations to settle.
  await expect
    .poll(
      () =>
        screen.container
          .querySelector("#search-results")!
          .parentElement!.parentElement!.getBoundingClientRect().height,
    )
    .toBe(0);
  await expect
    .poll(() =>
      Math.abs(
        screen.container
          .querySelector("section.row-start-2")!
          .getBoundingClientRect().top - top,
      ),
    )
    .toBeLessThan(1);
  await expect
    .poll(
      () =>
        screen.container
          .getAnimations({ subtree: true })
          .filter(
            (animation) =>
              animation.playState === "running" &&
              animation.effect?.getTiming().iterations !== Infinity,
          ).length,
    )
    .toBe(0);
  const finalRects = rects();
  expect(finalRects).toHaveLength(initialRects.length);
  for (const [i, rect] of finalRects.entries()) {
    for (const [j, value] of rect.entries()) {
      expect(Math.abs(value - initialRects[i][j])).toBeLessThan(1);
    }
  }
});
