export function slugify(text: string) {
  return text
    .toString()
    // Remove Svelte components like <Math math={nSquared} />
    .replace(/<[^>]*\/>/g, '')
    // Remove Svelte expressions like {variable}
    .replace(/{[^}]*}/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars except -
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start
    .replace(/-+$/, '');       // Trim - from end
}
