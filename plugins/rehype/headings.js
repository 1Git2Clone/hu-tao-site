import { visit } from "unist-util-visit";
import katex from "katex";

// The site's URL contract, and deliberately the same module the table of
// contents and the post title call at render time. See its own comment: two
// copies of a slug function have to agree forever, and they do not.
import { slugify } from "../../src/lib/utils/slugify.ts";

/** Every heading element, by tag name. */
const HEADINGS = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };

/**
 * KaTeX options skavex renders the body with, so a formula in the table of
 * contents is the same markup as the one in the prose.
 *
 * @type {import('katex').KatexOptions}
 */
const KATEX_OPTIONS = {
  output: "htmlAndMathml",
  strict: false,
  throwOnError: false,
};

/**
 * Concatenate the text of a node's descendants.
 *
 * Deliberately not `hast-util-to-string`: this runs before KaTeX, when maths is
 * still a `<code class="math-inline">` holding its LaTeX source, and that source
 * is exactly what should reach the slug.
 *
 * @param {import('hast').Nodes} node The subtree to flatten.
 * @returns {string} Its text, with maths as its LaTeX source.
 */
function textOf(node) {
  if (node.type === "text") return node.value;
  if (!("children" in node)) return "";
  return node.children.map(textOf).join("");
}

/**
 * Is this the element remark-math leaves behind for an inline formula?
 *
 * @param {import('hast').Nodes} node The node to test.
 * @returns {boolean} True for the `<code class="math-inline">` remark-math emits.
 */
function isInlineMath(node) {
  if (node.type !== "element") return false;
  const className = node.properties.className;
  return Array.isArray(className) && className.includes("math-inline");
}

/**
 * Render a heading's children to display markup, typesetting any maths.
 *
 * @param {import('hast').Nodes} node The heading, or one of its descendants.
 * @returns {string} Display markup, maths already rendered.
 */
function htmlOf(node) {
  if (node.type === "text") return node.value;
  if (isInlineMath(node))
    return katex.renderToString(textOf(node), KATEX_OPTIONS);
  if (!("children" in node)) return "";
  return node.children.map(htmlOf).join("");
}

/**
 * Rehype plugin that gives headings stable ids and collects them for the table
 * of contents.
 *
 * Belongs to this site rather than to skavex: skavex is a markdown-to-Svelte
 * pipeline, and the shape a table of contents needs is a property of the
 * navigation that renders it. `Heading` in `$lib/data/posts` is that shape, and
 * this is what fills it.
 *
 * Goes in `rehypePlugins`, which skavex runs BEFORE KaTeX, and that ordering is
 * the part skavex contributes. Afterwards a heading containing maths has
 * KaTeX's markup as its text content, so an id derived then would be a slug of
 * `<span class="katex">…` and would change whenever KaTeX's output did —
 * breaking every anchor anyone has shared.
 *
 * @param {object} [options] How much of the document to cover.
 * @param {number[]} [options.levels] Heading levels to process. Default `[2, 3]`,
 *   which is what the table of contents styles; a deeper heading would arrive
 *   unindented and read like a section.
 * @returns {(tree: import('hast').Root, file: import('vfile').VFile) => void} A
 *   unified transformer that assigns ids and collects the entries onto `data.fm`.
 */
export function rehypeHeadings(options = {}) {
  const levels = options.levels ?? [2, 3];

  return (tree, file) => {
    /** @type {{id: string, level: number, html: string}[]} */
    const headings = [];

    // Every id already on the tree is reserved before one is generated, so a
    // generated id never lands on an id somebody wrote by hand.
    /** @type {Set<string>} */
    const taken = new Set();
    visit(tree, "element", (node) => {
      const written = String(node.properties.id ?? "");
      if (written) taken.add(written);
    });

    visit(tree, "element", (node) => {
      const level =
        HEADINGS[/** @type {keyof typeof HEADINGS} */ (node.tagName)];
      if (level === undefined || !levels.includes(level)) return;

      const written = String(node.properties.id ?? "");
      let id = written;

      if (!id) {
        // A post that repeats a heading would otherwise emit the same id
        // twice, which is invalid and sends every link to the second one to
        // the first.
        const base = slugify(textOf(node)) || "heading";
        id = base;
        for (let n = 1; taken.has(id); n++) id = `${base}-${n}`;
      }

      taken.add(id);
      node.properties.id = id;
      headings.push({ id, level, html: htmlOf(node) });
    });

    const existing = /** @type {Record<string, unknown>} */ (
      file.data.fm ?? {}
    );
    file.data.fm = { ...existing, headings };
  };
}
