// Usage: pnpm compute-blog-id src/lib/content/posts/<post>.md
//
// Prints a UUIDv7 for a post's frontmatter `id`. Its timestamp is the commit
// that added the file, or UTC midnight of the frontmatter `date` when the file
// is not committed yet. The time-ordered prefix keeps ids sortable by age.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export function uuidv7(ms: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  for (let i = 0; i < 6; i++)
    bytes[i] = Math.floor(ms / 2 ** (8 * (5 - i))) % 256;
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 9562 variant
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function timestampOf(file: string): number {
  const added = execFileSync(
    "git",
    ["log", "--diff-filter=A", "--format=%aI", "--", file],
    {
      encoding: "utf8",
    },
  )
    .trim()
    .split("\n")
    .filter(Boolean)
    .at(-1);
  if (added) return Date.parse(added);

  const date = readFileSync(file, "utf8")
    .match(/^date:\s*(.+)$/m)?.[1]
    ?.replace(/^['"]|['"]$/g, "");
  const local = date ? new Date(date) : undefined;
  if (!local || Number.isNaN(local.getTime())) {
    throw new Error(
      `${file}: not committed and no parseable frontmatter \`date\`.`,
    );
  }
  return Date.UTC(local.getFullYear(), local.getMonth(), local.getDate());
}

if (import.meta.main) {
  const file = process.argv[2];
  if (!file) {
    console.error(
      "Usage: pnpm compute-blog-id src/lib/content/posts/<post>.md",
    );
    process.exit(1);
  }
  console.log(uuidv7(timestampOf(file)));
}
