import type { TECH_URLS } from "$lib/content/root/tech";

type Assert<T extends true> = T;

// svelte-check must fail if a Record<string, ...> erases the known key union.
export type TechnologyKeysStayLiteral = Assert<
  string extends keyof typeof TECH_URLS ? false : true
>;
