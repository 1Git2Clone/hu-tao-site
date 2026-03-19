export function slugify(text) {
  return text
    .toString()
    .replace(/<[^>]*\/>/g, '')
    .replace(/{[^}]*}/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}
