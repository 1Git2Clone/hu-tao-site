// Run: node scripts/checks/seo.ts
import assert from "node:assert/strict";
import { ROUTES, jsonLd, jsonLdTag } from "../../src/lib/data/seo.ts";

// Both public handles identify the same person and the profile points to them.
assert.equal(ROUTES["/"].title, "Ivan (1Kill2Steal/1Git2Clone)");
const graph = jsonLd(ROUTES["/"], "https://hu-tao.dev/")["@graph"];
const person = graph.find((node) => node["@type"] === "Person")!;
assert.equal(person.name, "Ivan");
assert.deepEqual(person.alternateName, ["1Kill2Steal", "1Git2Clone"]);
assert.deepEqual(graph.at(-1)?.mainEntity, { "@id": person["@id"] });

// A title can't close the JSON-LD script tag early, and the JSON still parses.
const hostile = { ...ROUTES["/infra"], title: "</script><script>alert(1)" };
const tag = jsonLdTag(hostile, "https://hu-tao.dev/infra");
const body = tag.slice(tag.indexOf(">") + 1, tag.lastIndexOf("</script>"));
assert.ok(!body.includes("<"), "unescaped < in JSON-LD");
const page = JSON.parse(body)["@graph"].at(-1);
assert.equal(page.name, hostile.title);

// A post's publish date is the day it was written, whatever the timezone.
const post = ROUTES["/blogs/[slug]"]({
  title: "t",
  summary: "s",
  date: "March 17 2026" as unknown as Date,
  tags: ["dsa"],
} as Parameters<(typeof ROUTES)["/blogs/[slug]"]>[0]);
assert.equal(post.post?.published, "2026-03-17");
const article = jsonLd(post, "https://hu-tao.dev/blogs/example")["@graph"].at(
  -1,
)!;
assert.deepEqual(article.author, { "@id": person["@id"] });
// A site logo is not an article illustration when a post has no own image.
assert.ok(!("image" in article));

const image = {
  url: "/images/blogs/chart.png",
  type: "image/png" as const,
  width: 1200,
  height: 800,
  alt: "An algorithm complexity chart",
};
const illustratedPost = ROUTES["/blogs/[slug]"]({
  title: "Illustrated article",
  summary: "An article with its own chart",
  date: "March 17 2026" as unknown as Date,
  tags: ["dsa"],
  image,
} as Parameters<(typeof ROUTES)["/blogs/[slug]"]>[0]);
assert.deepEqual(illustratedPost.image, {
  ...image,
  url: "https://hu-tao.dev/images/blogs/chart.png",
});
assert.equal(
  jsonLd(illustratedPost, "https://hu-tao.dev/blogs/illustrated")["@graph"].at(
    -1,
  )?.image,
  illustratedPost.image?.url,
);

console.log("seo: ok");
