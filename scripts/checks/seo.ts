// Run: node scripts/checks/seo.ts
import assert from "node:assert/strict";
import { ROUTES, jsonLdTag } from "../../src/lib/data/seo.ts";

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

console.log("seo: ok");
