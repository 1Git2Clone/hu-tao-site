import { marked } from 'marked';

import { PRIVATE_SERVICES, PUBLIC_SERVICES } from '$lib/content/infra/services';
import { OVERVIEW, OVERVIEW_SIZES } from '$lib/content/infra/topology';
import { wideAndTall } from '$lib/data/graph-layout';
import type { Graph, OverviewNode } from '$lib/types/infra-graph';
import type { PageServerLoad } from './$types';

// Untangling takes a few seconds: once at build, and once per dev-server start.
export const prerender = true;

const overview = wideAndTall(OVERVIEW, OVERVIEW_SIZES);

// Markdown becomes HTML here, at build, so `marked` never ships to the browser.
const html = (markdown: string) => marked.parse(markdown, { async: false });

const graph: Graph<OverviewNode> = {
	...OVERVIEW,
	nodes: OVERVIEW.nodes.map((node) => ({ ...node, description: html(node.description) }))
};

export const load: PageServerLoad = () => ({
	overview,
	graph,
	services: { public: html(PUBLIC_SERVICES), private: html(PRIVATE_SERVICES) }
});
