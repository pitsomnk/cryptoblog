import { notFound } from "next/navigation";
import { posts } from "../../../data/posts";
import fs from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const post = posts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const filePath = path.join(process.cwd(), post.contentPath);
  let source = "";
  try {
    source = await fs.readFile(filePath, "utf8");
  } catch {
    return notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <div className="text-sm text-zinc-500">{post.category} • {post.date}</div>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">{post.title}</h1>
        <div className="mt-2 text-sm text-zinc-600">By {post.author}</div>
      </header>

      <section className="mt-8 prose max-w-none">
        <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}
