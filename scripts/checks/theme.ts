// Run: node scripts/checks/theme.ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const themeFile = "src/lib/styles/themes.css";
const errors: string[] = [];

// Preserve lines so failures point at the original file. Comments can describe
// colours; they do not paint anything. Do not strip // inside URLs or strings.
function withoutComments(source: string) {
  return source
    .replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, (s) =>
      s.replace(/[^\n]/g, " "),
    )
    .replace(/^\s*\/\/[^\n]*/gm, (s) => s.replace(/[^\n]/g, " "));
}

function report(file: string, source: string, index: number, message: string) {
  const line = source.slice(0, index).split("\n").length;
  errors.push(`${file}:${line}: ${message}`);
}

// This file deliberately has a small grammar: flat theme blocks containing
// custom properties only. A new palette must implement the complete contract.
const themeSource = withoutComments(
  readFileSync(join(root, themeFile), "utf8"),
);
const blocks = [...themeSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
assert.ok(blocks.length >= 2, "theme: light and dark blocks are required");
assert.equal(
  blocks[0][1].trim(),
  "@theme static",
  "theme: light must come first",
);
assert.equal(blocks[1][1].trim(), ":root.dark", "theme: dark must come second");
assert.equal(
  themeSource.replace(/([^{}]+)\{([^{}]*)\}/g, "").trim(),
  "",
  "theme: only flat theme blocks are allowed",
);
const selectors = new Set<string>();
const themes = blocks.map((block) => {
  const selector = block[1].trim();
  assert.ok(
    /^(?:@theme static|:root\.dark|:root\[data-theme="[a-z][a-z0-9-]*"\])$/.test(
      selector,
    ),
    `theme: unsupported selector ${selector}`,
  );
  assert.ok(!selectors.has(selector), `theme: duplicate ${selector}`);
  selectors.add(selector);
  const values = new Map<string, string>();
  for (const declaration of block[2].split(";")) {
    if (!declaration.trim()) continue;
    const match = declaration.trim().match(/^(--[\w-]+)\s*:\s*([\s\S]+)$/);
    assert.ok(match, `theme: expected a custom property in ${selector}`);
    const [, name, value] = match;
    assert.ok(!values.has(name), `theme: duplicate ${name} in ${selector}`);
    assert.ok(
      !/^(?:initial|inherit|unset|revert(?:-layer)?)$/.test(value.trim()),
      `theme: ${selector} must define ${name}, not reset it`,
    );
    values.set(name, value.trim());
  }
  assert.match(
    values.get("--color-terminal-tint") ?? "",
    /^#[\da-f]{6}$/i,
    `theme: ${selector} needs a six-digit hex terminal tint`,
  );
  return { selector, values };
});
const contract = [...themes[0].values.keys()].sort();
// Read the palette from the installed Tailwind, so a new palette is caught too.
const tailwindColours = [
  ...readFileSync(
    join(root, "node_modules/tailwindcss/theme.css"),
    "utf8",
  ).matchAll(/--color-([a-z]+(?:-\d+)?)\s*:/g),
].map((match) => match[1]);
assert.ok(
  tailwindColours.includes("red-700"),
  "theme: Tailwind palette not found",
);
const palette = `(?:${tailwindColours.join("|")})`;
for (const { selector, values } of themes.slice(1)) {
  const missing = contract.filter((name) => !values.has(name));
  const extra = [...values.keys()].filter(
    (name) => !themes[0].values.has(name),
  );
  if (missing.length || extra.length) {
    errors.push(
      `${themeFile}: ${selector}: missing [${missing.join(", ")}]; extra [${extra.join(", ")}]`,
    );
  }
}

for (const { selector, values } of themes) {
  for (const [name, value] of values) {
    for (const match of value.matchAll(/\bvar\(\s*(--color-[\w-]+)/g)) {
      if (
        !themes[0].values.has(match[1]) &&
        !new RegExp(`^--color-${palette}$`).test(match[1])
      ) {
        errors.push(
          `${themeFile}: ${selector}: ${name} refers to unknown ${match[1]}`,
        );
      }
    }
  }
}

const colourUtility =
  "(?:bg|text|border(?:-[xysetblr])?|divide|ring(?:-offset)?|outline|shadow|inset-shadow|fill|stroke|from|via|to|accent|caret|decoration|placeholder)";
const roleNames = contract
  .filter((name) => name.startsWith("--color-"))
  .map((name) => name.slice("--color-".length))
  .join("|");
const namedColour =
  "(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)";
const colourProperty =
  "(?:color|background(?:-color)?|border(?:-[a-z-]+)?|outline(?:-color)?|(?:box|text)-shadow|fill|stroke|stop-color|flood-color|lighting-color|accent-color|caret-color)";
const forbidden = [
  /#[\da-f]{3,8}\b/gi,
  /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/gi,
  new RegExp(`\\b${colourUtility}-${palette}\\b`, "g"),
  // A dark colour override moves the theme decision back into a component.
  new RegExp(
    `\\bdark:(?:[\\w-]+:)*${colourUtility}-(?:${roleNames}|current|inherit|transparent|\\[|\\()`,
    "g",
  ),
  // A .dark selector does the same; the custom-variant line defines dark: itself.
  /^(?!@custom-variant dark ).*?(?<![\w-])\.dark(?![a-z\d-])/gim,
  // Prose colour modifiers replace the palette's prose roles.
  new RegExp(
    `\\bprose-(?:invert|${[...new Set(tailwindColours.map((c) => c.split("-")[0]))].join("|")})\\b`,
    "g",
  ),
  new RegExp(
    `\\b${colourProperty}\\s*[:=]\\s*["']?[^;"'{}\\n]*\\b${namedColour}\\b`,
    "gi",
  ),
  // Arbitrary values use _ for spaces, and \b does not split _black.
  new RegExp(
    `\\b${colourUtility}-\\[[^\\]]*(?<![a-z-])${namedColour}(?![a-z])`,
    "gi",
  ),
  // A mix can sit in a script string or a custom property, with no property name.
  new RegExp(`\\bcolor-mix\\([^;\\n]*\\b${namedColour}\\b`, "gi"),
  /\bvar\(\s*--color-(?:white|black|[a-z]+-\d+)\b/g,
];

function inspect(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    const file = relative(root, path);
    // The licensed shader renderer has its own low-level colour contract.
    // Static artwork and authored Markdown/code examples are not UI styles.
    if (file === "src/lib/vendor/faulty-terminal") continue;
    if (entry.isDirectory()) {
      inspect(path);
    } else if (/\.(?:svelte|css|[cm]?[jt]s|html)$/.test(entry.name)) {
      if (file === themeFile) continue;
      const source = withoutComments(readFileSync(path, "utf8"));
      for (const pattern of forbidden) {
        for (const match of source.matchAll(pattern)) {
          report(
            file,
            source,
            match.index,
            `use a theme role instead of ${match[0]}`,
          );
        }
      }
      for (const match of source.matchAll(/\bvar\(\s*(--color-[\w-]+)/g)) {
        if (!themes[0].values.has(match[1])) {
          report(file, source, match.index, `unknown theme role ${match[1]}`);
        }
      }
    }
  }
}
inspect(join(root, "src"));
assert.equal(errors.length, 0, `theme contract failed:\n${errors.join("\n")}`);
console.log(
  `theme: ${themes.length} complete themes, ${contract.length} roles; UI colours use tokens`,
);
