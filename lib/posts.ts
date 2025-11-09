import { createClient as createServerSupabase } from "../utils/supabase/server";
import { Post } from "../types/post";

const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function getPosts(): Promise<Post[]> {
  if (!useSupabase) {
    // dynamic import to avoid ESM/TS issues
    const mod = await import('../data/posts');
    return mod.posts as Post[];
  }

  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
    if (error) {
      // If the posts table doesn't exist, silently fall back to local data.
      // This happens during early dev or when Supabase is configured but
      // the schema hasn't been created yet.
  // PostgREST returns an error object with a `code` property when the
  // table is missing; guard with unknown-to-typed checks to avoid `any`.
  const errObj = error as unknown as { code?: string };
  if (errObj && errObj.code === 'PGRST205') {
        const mod = await import('../data/posts');
        return mod.posts as Post[];
      }
      // For other errors, log once and fall back to local data.
      console.warn('supabase getPosts error - falling back to local posts', error?.message ?? error);
      const mod = await import('../data/posts');
      return mod.posts as Post[];
    }
    return (data ?? []) as Post[];
  } catch (err) {
    console.warn('getPosts caught error, falling back to local posts', err);
    const mod = await import('../data/posts');
    return mod.posts as Post[];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!useSupabase) {
    const mod = await import('../data/posts');
    const p = (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
    return p;
  }

  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).limit(1).single();
    if (error) {
  const errObj2 = error as unknown as { code?: string };
  if (errObj2 && errObj2.code === 'PGRST205') {
        const mod = await import('../data/posts');
        return (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
      }
      console.warn('supabase getPostBySlug error - falling back to local', error?.message ?? error);
      const mod = await import('../data/posts');
      return (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
    }
    return data as Post;
  } catch (err) {
    console.warn('getPostBySlug caught error, falling back to local posts', err);
    const mod = await import('../data/posts');
    return (mod.posts as Post[]).find((x) => x.slug === slug) ?? null;
  }
}
