import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import Links from "./Links.svelte";
import Twitter from "$lib/components/icons/Twitter.svelte";

test("the Twitter SVG has its own Twitter label", async () => {
  const screen = await render(Twitter);
  expect(
    screen.container.querySelector("svg")?.getAttribute("aria-label"),
  ).toBe("Twitter");
});

test("link cards render dot, component and Nerd icons with safe external links", async () => {
  const screen = await render(Links);
  const blogs = screen.getByRole("link", { name: "Blogs" }).element();
  const github = screen.getByRole("link", { name: "GitHub" }).element();
  const nix = screen.getByRole("link", { name: "Nix" }).element();
  expect(blogs.querySelector("circle")?.getAttribute("r")).toBe("3");
  expect(blogs.getAttribute("target")).toBeNull();
  expect(blogs.getAttribute("rel")).toBeNull();
  for (const link of [github, nix]) {
    expect(link.querySelector("svg path")).not.toBeNull();
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.querySelector("svg")?.getAttribute("width")).toBe("20");
  }
});
