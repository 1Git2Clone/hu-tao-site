// Run: node scripts/checks/related.ts
import assert from "node:assert/strict";
import type { Post } from "../../src/lib/data/posts.ts";
import {
  dateScore,
  relatedPosts,
  tagScore,
  validatePostIds,
} from "../../src/lib/data/related.ts";

// Valid UUIDv7s whose last digits are the number, so assertions stay readable.
const uid = (n: number) =>
  `00000000-0000-7000-8000-${String(n).padStart(12, "0")}`;
const post = (
  n: number,
  date: string,
  tags: string[],
  related?: number[],
): Post =>
  ({
    slug: `p${n}`,
    metadata: { id: uid(n), date, tags, related: related?.map(uid) },
  }) as unknown as Post;
const ids = (posts: Post[]) =>
  posts.map((p) => Number(p.metadata.id.slice(-12)));
const score = (current: Post, candidate: Post) => ({
  current,
  candidate,
  candidates: [],
});

const current = post(1, "April 24 2024", ["a", "b", "c"]);

// Tags: +1 each, +1 once more than 70% of the current post's tags are shared.
assert.equal(
  tagScore(score(current, post(2, "Jan 1 2000", ["a", "b", "c"]))),
  4,
);
assert.equal(tagScore(score(current, post(3, "Jan 1 2000", ["a", "b"]))), 2); // 66% is not over 70%
assert.equal(tagScore(score(current, post(4, "Jan 1 2000", ["x"]))), 0);

// Date, relative to the current post: same day 5, week 3, 30 days 2, else 0.
assert.equal(dateScore(score(current, post(5, "April 24 2024", []))), 5);
assert.equal(dateScore(score(current, post(6, "April 20 2024", []))), 3);
assert.equal(dateScore(score(current, post(7, "May 20 2024", []))), 2);
assert.equal(dateScore(score(current, post(8, "Jan 1 2023", []))), 0);

// Untagged posts never qualify; best score first; newest wins a tie.
const posts = [
  current,
  post(10, "Jan 1 2020", ["a"]), // 1
  post(11, "Jan 1 2021", ["a"]), // 1, newer than 10
  post(12, "April 25 2024", ["a"]), // 1 + 3
  post(13, "April 24 2024", ["x"]), // same day, but no shared tag
];
assert.deepEqual(ids(relatedPosts(current, posts)), [12, 11, 10]);
assert.deepEqual(ids(relatedPosts(current, posts, { limit: 1 })), [12]);

// Same score, same day: the larger (later) UUIDv7 comes first.
assert.deepEqual(
  ids(
    relatedPosts(current, [
      current,
      post(20, "Jan 1 2020", ["a"]),
      post(21, "Jan 1 2020", ["a"]),
    ]),
  ),
  [21, 20],
);

// Frontmatter `related` overrides the ranking, in its own order.
const picked = post(1, "April 24 2024", ["a"], [13, 10]);
assert.deepEqual(ids(relatedPosts(picked, posts)), [13, 10]);

// Nothing shares a tag: empty, and the page shows the chickens card.
assert.deepEqual(relatedPosts(post(1, "April 24 2024", ["zzz"]), posts), []);

// Ids: integer, unique, and `related` only names other posts.
assert.doesNotThrow(() => validatePostIds(posts));
assert.throws(
  () => validatePostIds([post(1, "x", []), post(1, "y", [])]),
  /share id/,
);
assert.throws(
  () =>
    validatePostIds([
      {
        slug: "v4",
        metadata: { id: crypto.randomUUID(), tags: [] },
      } as unknown as Post,
    ]),
  /UUIDv7/,
);
assert.throws(() => validatePostIds([post(1, "x", [], [9])]), /not a post/);
assert.throws(() => validatePostIds([post(1, "x", [], [1])]), /itself/);

console.log("related: all checks passed");
