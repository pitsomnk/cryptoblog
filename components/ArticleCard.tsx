import Link from "next/link";
import Image from "next/image";
import type { Post } from "../types/post";

// Calculate estimated reading time
function getReadingTime(excerpt: string): string {
  // Estimate based on average article length (excerpt is ~15% of full content)
  const estimatedWords = excerpt.split(' ').length * 7;
  const minutes = Math.ceil(estimatedWords / 200);
  return `${minutes} min read`;
}

// Check if post is new (within last 7 days)
function isNewPost(dateString: string): boolean {
  try {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffDays = (now.getTime() - postDate.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 7;
  } catch {
    return false;
  }
}

export default function ArticleCard({ post }: { post: Post }) {
  const readingTime = getReadingTime(post.excerpt);
  const isNew = isNewPost(post.date);

  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-zinc-100 p-4 transition-all duration-300 hover:shadow-lg hover:border-zinc-200 dark:border-zinc-800 dark:hover:border-zinc-700 hover:-translate-y-1">
      <Link href={`/posts/${post.slug}`} className="flex items-start gap-4">
        <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              width={192}
              height={128}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-sky-400 to-indigo-600 transition-transform duration-500 group-hover:scale-110" />
          )}
          {isNew && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
              NEW
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="rounded-full bg-linear-to-r from-sky-100 to-indigo-100 px-3 py-1 text-xs font-medium text-sky-700 dark:from-sky-900 dark:to-indigo-900 dark:text-sky-300">{post.category}</span>
            <span className="text-zinc-400">{post.date}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">{readingTime}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{post.excerpt}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-500">By {post.author}</span>
            <span className="text-sm font-medium text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
