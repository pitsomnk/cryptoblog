import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPosts } from "../../../lib/posts";

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

// Calculate reading time
function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Format date for better readability
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  if (!post.contentPath) return notFound();

  const filePath = path.join(process.cwd(), post.contentPath);
  let source = "";
  try {
    source = await fs.readFile(filePath, "utf8");
  } catch {
    return notFound();
  }

  const readingTime = getReadingTime(source);
  const formattedDate = formatDate(post.date);

  // Get related posts (same category, excluding current)
  const allPosts = await getPosts();
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="bg-(--color-background)">
      {/* Hero Header */}
      <header className="relative bg-(--color-background) border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <Link href={`/${post.category.toLowerCase()}`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">{post.category}</Link>
            <span>→</span>
            <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-linear-to-r from-sky-500 to-indigo-600 text-white shadow-lg">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-zinc-900 dark:text-white">{post.author}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{formattedDate}</div>
              </div>
            </div>
            <span className="hidden sm:block text-zinc-300 dark:text-zinc-600">|</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xl">📖</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="mx-auto max-w-4xl px-6 mt-8">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={post.image}
              alt={post.title}
              width={900}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Quick Summary Box */}
        <div className="mb-10 p-6 rounded-xl bg-linear-to-r from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 border border-sky-100 dark:border-sky-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Quick Summary</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
            </div>
          </div>
        </div>

        {/* Table of Contents Hint */}
        <div className="mb-8 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <span>📚</span>
            <span><strong>Reading tip:</strong> Scroll through the headings to navigate this article quickly.</span>
          </p>
        </div>

        {/* Main Content with Enhanced Prose */}
        <section className="prose prose-lg prose-zinc dark:prose-invert max-w-none
          prose-headings:scroll-mt-20
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-700
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
          prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2
          prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-sky-600 dark:prose-a:text-sky-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
          prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-strong:font-semibold
          prose-ul:my-4 prose-ul:space-y-2
          prose-ol:my-4 prose-ol:space-y-2
          prose-li:text-zinc-700 dark:prose-li:text-zinc-300
          prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50 dark:prose-blockquote:bg-sky-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
          prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border prose-pre:border-zinc-700
          prose-img:rounded-xl prose-img:shadow-lg
          prose-table:border-collapse prose-table:w-full
          prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold
          prose-td:p-3 prose-td:border-b prose-td:border-zinc-200 dark:prose-td:border-zinc-700
        ">
          <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </section>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          {/* Share Section */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Share this article</h4>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-[#1DA1F2] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                𝕏 Twitter
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                LinkedIn
              </button>
              <button className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:opacity-90 transition-opacity">
                📋 Copy Link
              </button>
            </div>
          </div>

          {/* Author Box */}
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {post.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Written by {post.author}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Contributing writer at CryptoStarter, covering {post.category.toLowerCase()} and blockchain trends.
                </p>
                <Link href="/" className="text-sm text-sky-600 dark:text-sky-400 font-medium hover:underline">
                  View all articles →
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center gap-3">
              <span>📰</span> Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.slug}
                  href={`/posts/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="h-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    {relatedPost.image && (
                      <div className="h-32 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          width={300}
                          height={128}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-zinc-500 mt-2">{relatedPost.date}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-12 bg-linear-to-r from-sky-600 via-indigo-600 to-purple-600">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-white/90 mb-6">
            Get more insights like this delivered to your inbox every week. Join our newsletter!
          </p>
          <Link 
            href="/newsletter"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-zinc-100 transition-colors shadow-lg"
          >
            Subscribe Free →
          </Link>
        </div>
      </section>
    </div>
  );
}

