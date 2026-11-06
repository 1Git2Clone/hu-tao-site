export type NodeKind = "infra" | "public" | "private";

export type GraphNode = {
  id: string;
  label: string;
  kind: NodeKind;
};

export type OverviewNode = GraphNode & {
  /** Markdown, one or two sentences, in `topology.ts`; the page's server load renders it to HTML. */
  description: string;
};

export type GraphLink<Id extends string = string> = {
  source: Id;
  target: Id;
};

export type Graph<N extends GraphNode = GraphNode> = {
  nodes: N[];
  links: GraphLink<N["id"]>[];
};
