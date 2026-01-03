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
    <article className="group mb-8 rounded-md border border-zinc-100 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-zinc-800">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="h-56 w-full shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 lg:w-1/3">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={224}
              className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full transform transition-transform duration-500 group-hover:scale-105 bg-linear-to-br from-sky-400 to-indigo-600" />
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm text-zinc-500">{post.category} • {post.date}</div>
            {isRecent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                NEW
              </span>
            )}
          </div>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">{post.title}</h2>
          <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-300">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-4">
            <Link href={`/posts/${post.slug}`} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition-colors duration-150 hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900">Read full story</Link>
            <div className="text-sm text-zinc-500">By {post.author}</div>
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

  return (
    <div className="bg-(--color-background) py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            {featured && <Featured post={featured} />}

            {/* Top Stories Section */}
            {topStories.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 pb-2">Top Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <h3 className="mb-4 text-2xl font-semibold">More stories</h3>
                <div className="flex flex-col gap-4">
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
