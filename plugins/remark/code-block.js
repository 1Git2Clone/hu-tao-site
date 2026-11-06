import { visit } from "unist-util-visit";
import { createHighlighter } from "shiki";
import { componentNode, rawHtmlExpression } from "@skavex/skavex/utils";

const THEME = "rose-pine-moon";

/**
 * Aliases a post might write, mapped to the language shiki knows.
 *
 * @type {Record<string, string>}
 */
const languageMap = {
  ".rs": "rust",
  ".py": "python",
  ".js": "javascript",
  ".ts": "typescript",
  ".jsx": "jsx",
  ".tsx": "tsx",
  ".html": "html",
  ".css": "css",
  ".json": "json",
  ".md": "markdown",
  ".sh": "bash",
  ".rb": "ruby",
  ".go": "go",
  ".php": "php",
  ".r": "r",
  ".c": "c",
  ".cpp": "cpp",
  ".cs": "csharp",
  ".java": "java",
  ".kt": "kotlin",
  ".sql": "sql",
  "c#": "csharp",
  "c++": "cpp",
};

const LANGUAGES = [
  "rust",
  "python",
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "markdown",
  "bash",
  "ruby",
  "go",
  "php",
  "r",
  "c",
  "cpp",
  "csharp",
  "java",
  "kotlin",
  "sql",
];

const highlighter = await createHighlighter({
  themes: [THEME],
  langs: LANGUAGES,
});

/**
 * Shiki emits its own padding, margin and background on the `<pre>`, which
 * fights the surrounding card. Strip those three and restate them so the block
 * sits flush inside `CodeBlock`, and lift two comment greys that are too dim
 * against this theme's background to read.
 *
 * @type {import('shiki').ShikiTransformer[]}
 */
const transformers = [
  {
    span(node) {
      const dimComments = ["#908CAA", "#6E6A86"];
      const readable = "#F4CFCF";
      const style = node.properties.style;
      if (typeof style !== "string") return;

      for (const dim of dimComments) {
        if (style.includes(dim)) {
          node.properties.style = style.replace(dim, readable);
          return;
        }
      }
    },
    pre(node) {
      const existing =
        typeof node.properties.style === "string" ? node.properties.style : "";
      const cleaned = existing
        .replace(/padding:[^;]+;?/g, "")
        .replace(/margin:[^;]+;?/g, "")
        .replace(/background-color:[^;]+;?/g, "");

      node.properties.style = [
        cleaned,
        "padding: 1rem",
        "margin: 0",
        "background-color: var(--color-code-block)",
        "overflow: auto",
      ]
        .filter(Boolean)
        .join("; ");
    },
  },
];

/**
 * Remark plugin that replaces fenced code with a highlighted `<CodeBlock />`.
 *
 * Highlighting happens here, at build time, so the browser is served finished
 * markup rather than shiki and a grammar per language.
 *
 * @returns {(tree: import('mdast').Root) => void}
 */
export function remarkCodeBlock() {
  return (tree) => {
    /** @type {{node: any, index: number, parent: any}[]} */
    const found = [];

    visit(tree, "code", (node, index, parent) => {
      if (parent === undefined || index === undefined) return;
      found.push({ node, index, parent });
    });

    const loaded = highlighter.getLoadedLanguages();

    for (const { node, index, parent } of found) {
      const requested = node.lang?.toLowerCase() || "text";
      const mapped =
        languageMap[requested] || languageMap[`.${requested}`] || requested;
      // An unknown language must not fail the build; plain text still renders.
      const lang = loaded.includes(mapped) ? mapped : "text";

      const html = highlighter.codeToHtml(node.value, {
        lang,
        theme: THEME,
        transformers,
      });

      parent.children[index] = componentNode(
        "CodeBlock",
        { lang },
        rawHtmlExpression(html),
      );
    }
  };
}
