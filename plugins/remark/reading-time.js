import readingTime from "reading-time";
import { toString } from "mdast-util-to-string";

/**
 * Remark plugin that puts an estimated reading time on `data.fm`.
 *
 * Runs on the mdast tree, so the estimate is based on the prose the author
 * wrote. Measuring the rendered HTML instead would count KaTeX's markup and
 * every highlighted token as words.
 *
 * @returns {(tree: import('mdast').Root, file: import('vfile').VFile) => void}
 */
export function remarkReadingTime() {
  return (tree, file) => {
    const stats = readingTime(toString(tree));

    const existing = /** @type {Record<string, unknown>} */ (
      file.data.fm ?? {}
    );
    file.data.fm = { ...existing, readingTime: stats.text };
  };
}
