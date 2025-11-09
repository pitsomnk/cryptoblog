import NewsletterSignup from "../../components/NewsletterSignup";
import ArticleCard from "../../components/ArticleCard";
import { getPosts } from "../../lib/posts";

export const metadata = {
  title: "Newsletter — CryptoBlog",
  description: "Sign up for a weekly roundup of top crypto stories and analysis.",
  openGraph: {
    title: "Newsletter — CryptoBlog",
    description: "Sign up for a weekly roundup of top crypto stories and analysis.",
  },
};

export default async function NewsletterPage() {
  const posts = await getPosts();
  const latest = posts.slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-3xl font-bold">Newsletter</h1>
          <p className="mb-6 text-sm text-zinc-600">Sign up to receive our weekly newsletter with top crypto stories, analysis, and exclusive insights.</p>

          <h3 className="mb-2 text-xl font-semibold">Why subscribe?</h3>
          <ul className="mb-6 list-inside list-disc space-y-2 text-sm text-zinc-600">
            <li>Curated top stories so you don&apos;t miss market-moving events.</li>
            <li>Short summaries and links to the full analysis.</li>
            <li>Exclusive occasional deep dives for subscribers.</li>
          </ul>

          <h3 className="mb-4 text-lg font-semibold">Recent highlights</h3>
          <div className="flex flex-col gap-4">
            {latest.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </div>

        <aside>
          <NewsletterSignup />
        </aside>
      </div>
    </div>
  );
}
