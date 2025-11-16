import { Post } from "../types/post";
import { getDatabase } from "./mongodb";

const useMongoDB = Boolean(process.env.MONGODB_URI);

export async function getPosts(): Promise<Post[]> {
  if (!useMongoDB) {
    const mod = await import('../data/posts');
    return mod.posts as Post[];
  }

  try {
    const db = await getDatabase();
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      date: post.date,
      category: post.category,
      contentPath: post.contentPath,
      image: post.image,
      featured: post.featured,
    })) as Post[];
  } catch (error) {
    console.error('MongoDB getPosts error, falling back to local:', error);
    const mod = await import('../data/posts');
    return mod.posts as Post[];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!useMongoDB) {
    const mod = await import('../data/posts');
    return (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
  }

  try {
    const db = await getDatabase();
    const post = await db.collection('posts').findOne({ slug });
    
    if (!post) {
      return null;
    }

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      date: post.date,
      category: post.category,
      contentPath: post.contentPath,
      image: post.image,
      featured: post.featured,
    } as Post;
  } catch (error) {
    console.error('MongoDB getPostBySlug error, falling back to local:', error);
    const mod = await import('../data/posts');
    return (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
  }
}
