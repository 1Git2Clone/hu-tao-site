import { visit } from 'unist-util-visit';
import { ensureComponentImport, getBareLinkFromParagraph } from '../utils.js';

/**
 * @param {string} rawUrl
 * @returns {{id: string, timestamp: number} | null}
 */
function extractYouTubeIdAndTimestamp(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, '');
  let id;
  let timestamp = 0;

  if (hostname === 'youtube.com' || hostname === 'youtube.com.') {
    if (url.pathname !== '/watch') return null;
    id = url.searchParams.get('v');
    const t = url.searchParams.get('t');
    if (t) timestamp = Number(t) || 0;
  } else if (hostname === 'youtu.be') {
    id = url.pathname.slice(1);
    const t = url.searchParams.get('t');
    if (t) timestamp = Number(t) || 0;
  } else {
    return null;
  }

  if (!id) return null;

  return { id, timestamp };
}

/**
 * Remark plugin that transforms bare YouTube links into
 * `<YouTube />` Svelte components.
 *
 * @returns {(tree: import('unist').Node) => void}
 */
export function remarkYouTube() {
  return (tree) => {
    let hasYouTube = false;

    visit(tree, 'paragraph', (node, index, parent) => {
      let url = getBareLinkFromParagraph(node);
      if (!url) return;

      const data = extractYouTubeIdAndTimestamp(url);
      if (!data) return;

      const { id, timestamp } = data;

      hasYouTube = true;

      parent.children[index] = {
        type: 'html',
        value: `<YouTube id="${id}" timestamp={${timestamp}} title="" />`
      };
    });

    if (!hasYouTube) return;

    ensureComponentImport(tree, {
      importName: 'YouTube',
      importPath: '$lib/components/YouTube.svelte'
    });
  };
}
