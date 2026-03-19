import { loadSnippets } from '$lib/utils/snippets';

export const load = async () => {
  const snippets = loadSnippets();
  return { snippets };
};
