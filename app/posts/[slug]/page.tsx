import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { getPostBySlug } from "../../../lib/posts";

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

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

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <div className="text-sm text-zinc-500">{post.category} • {post.date}</div>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">{post.title}</h1>
        <div className="mt-2 text-sm text-zinc-600">By {post.author}</div>
        {post.image && (
          <div className="mt-6">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}
      </header>

      <section className="mt-8 prose max-w-none">
        <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </section>
    </article>
  );
}

