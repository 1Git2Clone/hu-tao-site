export type NodeKind = 'infra' | 'public' | 'private';

export type GraphNode = {
	id: string;
	label: string;
	kind: NodeKind;
};

export type OverviewNode = GraphNode & {
	/** Markdown, one or two sentences. */
	description: string;
};

export type GraphLink = {
	source: string;
	target: string;
};

export type Graph<N extends GraphNode = GraphNode> = {
	nodes: N[];
	links: GraphLink[];
};
