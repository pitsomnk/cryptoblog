import ArticleCard from "../components/ArticleCard";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "../lib/posts";
import type { Post } from "../types/post";

// Helper function to parse dates consistently
function parsePostDate(dateString: string): Date {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}, using current date as fallback`);
      return new Date();
    }
    return date;
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}, using current date as fallback`, error);
    return new Date();
  }
}

// Helper function to check if a post is recently published
function isRecentPost(dateString: string, daysThreshold: number = 7): boolean {
  const postDate = parsePostDate(dateString);
  const now = new Date();
  const diffTime = now.getTime() - postDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  return diffDays <= daysThreshold;
}

function Featured({ post }: { post: Post }) {
  const isRecent = isRecentPost(post.date);

  return (
    <article className="group mb-8 rounded-2xl border border-zinc-100 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-zinc-800 bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 lg:w-2/5">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              width={500}
              height={280}
              className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full transform transition-transform duration-500 group-hover:scale-105 bg-linear-to-br from-sky-400 to-indigo-600" />
          )}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-sky-500 to-indigo-600 text-white shadow-lg">
            ⭐ Featured
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-sky-100 to-indigo-100 text-sky-700 dark:from-sky-900 dark:to-indigo-900 dark:text-sky-300">
              {post.category}
            </span>
            <span className="text-sm text-zinc-500">{post.date}</span>
            {isRecent && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
                🆕 NEW
              </span>
            )}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">{post.title}</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-4">
            <Link href={`/posts/${post.slug}`} className="rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-sky-600 hover:to-indigo-700 shadow-md hover:shadow-lg">Read full story →</Link>
            <div className="text-sm text-zinc-500 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-linear-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0)}
              </span>
              {post.author}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const posts = await getPosts();

  // Sort posts by date (newest first) with robust date parsing
  const sorted = [...posts].sort((a, b) => {
    const dateA = parsePostDate(a.date).getTime();
    const dateB = parsePostDate(b.date).getTime();
    return dateB - dateA;
  });

  const featured = sorted[0];
  const topStories = sorted.slice(1, 4); // Get next 3 most recent stories
  const others = sorted.slice(4);

  // Get unique categories
  const categories = [...new Set(posts.map(p => p.category))];

  return (
    <div className="bg-(--color-background)">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-sky-600 via-indigo-600 to-purple-600 py-12 mb-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Welcome to CryptoStarter</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">Your trusted source for cryptocurrency news, analysis, and guides. Stay informed with the latest insights from the blockchain world.</p>
          <div className="flex justify-center gap-4">
            <Link href="/newsletter" className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-zinc-100 transition-colors shadow-lg">
              Subscribe Free
            </Link>
            <Link href="/guides" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/30">
              Browse Guides
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        {/* Category Filter Pills */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
            All Posts
          </span>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/${category.toLowerCase()}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-linear-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 hover:text-sky-700 dark:hover:text-sky-300 transition-all duration-200"
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            {featured && <Featured post={featured} />}

            {/* Top Stories Section */}
            {topStories.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔥</span>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Top Stories</h3>
                  <div className="flex-1 h-px bg-linear-to-r from-sky-500 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {topStories.map((post) => (
                    <Link 
                      key={post.slug} 
                      href={`/posts/${post.slug}`}
                      className="group"
                    >
                      <article className="h-full rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 transition-all duration-300 hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-600">
                        <div className="h-32 w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 mb-3">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={320}
                              height={128}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-linear-to-br from-purple-400 to-pink-500" />
                          )}
                        </div>
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                          <span>{post.category}</span>
                          {isRecentPost(post.date) && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              NEW
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                          {post.excerpt}
                        </p>
                        <div className="text-xs text-zinc-500 dark:text-zinc-500">
                          {post.date} • {post.author}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {others.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📰</span>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">More Stories</h3>
                  <div className="flex-1 h-px bg-linear-to-r from-indigo-500 to-transparent"></div>
                </div>
                <div className="flex flex-col gap-5">
                  {others.map((p) => (
                    <ArticleCard key={p.slug} post={p} />
                  ))}
                </div>
              </>
            )}
          </section>

          <aside className="lg:col-span-1">
            <Sidebar posts={posts} />
          </aside>
        </div>
      </div>
    </div>
  );
}
