import Link from "next/link";
import type { Post } from "../data/posts";

export default function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col gap-4 rounded-md border border-zinc-100 p-4 hover:shadow-sm dark:border-zinc-800">
      <Link href={`/posts/${post.slug}`} className="flex items-start gap-4">
  <div className="h-32 w-48 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
          {/* thumbnail placeholder */}
          <div className={`h-full w-full bg-gradient-to-br from-sky-400 to-indigo-600`} />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{post.category}</span>
            <span className="text-zinc-400">{post.date}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
          <div className="mt-3 text-sm text-zinc-500">By {post.author}</div>
        </div>
      </Link>
    </article>
  );
}
