// Re-exported rather than reimplemented. skavex derives every heading's `id`
// with this function during the build; the table of contents and the anchor
// links build their `href` with it at render time. A local copy would be a
// second definition that has to agree with the first forever.
export { slugify } from '@skavex/skavex';
