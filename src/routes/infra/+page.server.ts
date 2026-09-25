import { OVERVIEW, OVERVIEW_SIZES } from '$lib/content/infra/topology';
import { wideAndTall } from '$lib/data/graph-layout';
import type { PageServerLoad } from './$types';

// Untangling takes a few seconds: once at build, and once per dev-server start.
export const prerender = true;

const overview = wideAndTall(OVERVIEW, OVERVIEW_SIZES);

export const load: PageServerLoad = () => ({ overview });
