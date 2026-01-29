import Link from "next/link";
import type { Post } from "../types/post";

// Get unique categories from posts
function getCategories(posts: Post[]): { name: string; count: number }[] {
  const categoryMap = new Map<string, number>();
  posts.forEach(post => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Popular tags in crypto space
const popularTags = [
  { name: "Bitcoin", slug: "bitcoin" },
  { name: "Ethereum", slug: "ethereum" },
  { name: "DeFi", slug: "defi" },
  { name: "NFTs", slug: "nfts" },
  { name: "Web3", slug: "web3" },
  { name: "Regulation", slug: "regulation" },
  { name: "Security", slug: "security" },
  { name: "AI", slug: "ai" },
];

export default function Sidebar({ posts }: { posts: Post[] }) {
  const categories = getCategories(posts);

  return (
    <aside className="sticky top-20 w-full space-y-6">
      {/* Trending Posts */}
      <div className="rounded-xl border border-zinc-100 p-5 dark:border-zinc-800 bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="text-orange-500">🔥</span> Trending
        </h4>
        <ul className="flex flex-col gap-4">
          {posts.slice(0, 5).map((p, index) => (
            <li key={p.slug} className="group flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-linear-to-br from-sky-400 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link href={`/posts/${p.slug}`} className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2">
                  {p.title}
                </Link>
                <div className="text-xs text-zinc-500 mt-1">{p.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-zinc-100 p-5 dark:border-zinc-800">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>📂</span> Categories
        </h4>
        <ul className="flex flex-col gap-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link 
                href={`/${category.name.toLowerCase()}`} 
                className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="rounded-xl border border-zinc-100 p-5 dark:border-zinc-800">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>🏷️</span> Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <span
              key={tag.slug}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-linear-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 text-zinc-700 dark:text-zinc-300 hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer transition-all duration-200"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-xl border border-zinc-100 p-5 dark:border-zinc-800 bg-linear-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20">
        <h5 className="mb-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>📧</span> Stay Updated
        </h5>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get the latest crypto insights delivered to your inbox weekly.</p>
        <Link 
          href="/newsletter"
          className="block w-full text-center rounded-lg bg-linear-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Subscribe Free →
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="rounded-xl border border-zinc-100 p-5 dark:border-zinc-800">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>📊</span> Quick Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <div className="text-lg font-bold text-sky-600 dark:text-sky-400">{posts.length}</div>
            <div className="text-xs text-zinc-500">Articles</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{categories.length}</div>
            <div className="text-xs text-zinc-500">Categories</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
