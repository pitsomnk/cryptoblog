import { Post } from "../types/post";

export async function getPosts(): Promise<Post[]> {
  const mod = await import('../data/posts');
  return mod.posts as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const mod = await import('../data/posts');
  return (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
}
