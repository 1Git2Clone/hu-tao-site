export async function load() {
  const posts = import.meta.glob('$lib/content/posts/*.svx', {
    eager: true
  });

  const list = Object.entries(posts).map(([path, post]) => {
    const slug = path.split('/').pop()?.replace('.md', '');

    return {
      slug,
      ...(post as any).metadata
    };
  });

  return { posts: list };
}
