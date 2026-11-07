/**
 * Related posts. Pure functions only, with no runtime imports, so
 * `scripts/checks/related.ts` can run them under plain Node.
 */
import type { Post, PostMetadata } from "./posts";

/** What a related-post card needs, and all the server sends for one. */
export type RelatedPost = Pick<Post, "slug"> &
  Pick<PostMetadata, "title" | "date" | "readingTime">;

export interface ScoreContext<T> {
  current: T;
  candidate: T;
  candidates: readonly T[];
}

/** One criterion. A candidate's score is the sum of every scorer's result. */
export type Scorer<T> = (context: ScoreContext<T>) => number;

export interface Ranked<T> {
  candidate: T;
  score: number;
}

export const rank = <T>(
  current: T,
  candidates: readonly T[],
  scorers: readonly Scorer<T>[],
): Ranked<T>[] =>
  candidates.map((candidate) => ({
    candidate,
    score: scorers.reduce(
      (sum, scorer) => sum + scorer({ current, candidate, candidates }),
      0,
    ),
  }));

const sharedTags = (a: Post, b: Post): number =>
  b.metadata.tags.filter((tag) => a.metadata.tags.includes(tag)).length;

// Frontmatter dates arrive as strings ("April 24 2024"), whatever the type says.
const time = (post: Post): number => Date.parse(String(post.metadata.date));

const DAY = 24 * 60 * 60 * 1000;

// Same-day posts fall back to the id: a UUIDv7 starts with its timestamp, so it sorts by age.
const newestFirst = (a: Post, b: Post): number =>
  time(b) - time(a) || b.metadata.id.localeCompare(a.metadata.id);

/** +1 per shared tag, +1 more when they cover over 70% of the current post's tags. */
export const tagScore: Scorer<Post> = ({ current, candidate }) => {
  const shared = sharedTags(current, candidate);
  const total = current.metadata.tags.length;
  return shared + (total > 0 && shared / total > 0.7 ? 1 : 0);
};

/** Proximity to the current post's date: same day +5, within a week +3, within 30 days +2. */
export const dateScore: Scorer<Post> = ({ current, candidate }) => {
  const days = Math.abs(time(current) - time(candidate)) / DAY;
  if (days < 1) return 5;
  if (days <= 7) return 3;
  if (days <= 30) return 2;
  return 0;
};

export const POST_SCORERS: readonly Scorer<Post>[] = [tagScore, dateScore];

/**
 * Frontmatter `related` ids win, in their order. Otherwise every post sharing a
 * tag, best score first and newest on ties. Empty means nobody's here.
 */
export function relatedPosts(
  current: Post,
  posts: readonly Post[],
  { limit = 5, scorers = POST_SCORERS } = {},
): Post[] {
  const others = posts.filter(
    (post) => post.metadata.id !== current.metadata.id,
  );

  if (current.metadata.related?.length) {
    return current.metadata.related.flatMap((id) =>
      others.filter((p) => p.metadata.id === id),
    );
  }

  const tagged = others.filter((post) => sharedTags(current, post) > 0);
  return rank(current, tagged, scorers)
    .sort((a, b) => b.score - a.score || newestFirst(a.candidate, b.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

const UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * Every post needs a unique UUIDv7 `id` (`pnpm compute-blog-id <post.md>`), and
 * `related` may only name other posts.
 */
export function validatePostIds(posts: readonly Post[]): void {
  const slugById = new Map<string, string>();

  for (const { slug, metadata } of posts) {
    if (typeof metadata.id !== "string" || !UUID_V7.test(metadata.id)) {
      throw new Error(
        `Post "${slug}" needs a UUIDv7 \`id\` in its frontmatter (pnpm compute-blog-id), got ${JSON.stringify(metadata.id)}.`,
      );
    }
    const taken = slugById.get(metadata.id);
    if (taken)
      throw new Error(
        `Posts "${taken}" and "${slug}" share id ${metadata.id}.`,
      );
    slugById.set(metadata.id, slug);
  }

  for (const { slug, metadata } of posts) {
    for (const id of metadata.related ?? []) {
      if (id === metadata.id || !slugById.has(id)) {
        throw new Error(
          `Post "${slug}" lists related id ${id}, which is ${id === metadata.id ? "itself" : "not a post"}.`,
        );
      }
    }
  }
}
