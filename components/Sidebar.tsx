import Link from "next/link";
import type { Post } from "../types/post";

export default function Sidebar({ posts }: { posts: Post[] }) {
  return (
    <aside className="sticky top-16 w-full">
      <div className="rounded-md border border-zinc-100 p-4 dark:border-zinc-800">
        <h4 className="mb-3 text-sm font-semibold">Trending</h4>
        <ul className="flex flex-col gap-3">
          {posts.slice(0, 4).map((p) => (
            <li key={p.slug} className="text-sm">
              <Link href={`/posts/${p.slug}`} className="text-zinc-800 hover:underline dark:text-zinc-200">
                {p.title}
              </Link>
              <div className="text-xs text-zinc-500">{p.date} • {p.author}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-md border border-zinc-100 p-4 text-center dark:border-zinc-800">
        <h5 className="mb-2 text-sm font-semibold">Subscribe</h5>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Get the top stories every week.</p>
        <button className="mt-3 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900">Sign up</button>
      </div>
    </aside>
  );
}
