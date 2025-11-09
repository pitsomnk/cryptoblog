export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  contentPath?: string; // optional path to local MDX
  image?: string;
  featured?: boolean;
};

export type PostInsert = Omit<Post, 'date'> & { date?: string };
