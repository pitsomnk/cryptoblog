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
      console.error('supabase getPosts error', error);
      return [];
    }
    return (data ?? []) as Post[];
  } catch (err) {
    console.error('getPosts failed', err);
    return [];
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
      console.error('supabase getPostBySlug error', error);
      return null;
    }
    return data as Post;
  } catch (err) {
    console.error('getPostBySlug failed', err);
    return null;
  }
}
