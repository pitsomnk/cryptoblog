import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createClient as createSupabaseClient } from "../../../../utils/supabase/server";

type NewPostReq = {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  content: string; // MDX body (without frontmatter)
};

type Fields = NewPostReq & { featured?: boolean };

const POSTS_FILE = path.join(process.cwd(), "data", "posts.ts");
const CONTENT_DIR = path.join(process.cwd(), "content");

function safeSlug(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function postsContainSlug(slug: string) {
  try {
    const txt = await fs.readFile(POSTS_FILE, 'utf8');
    return txt.includes(`slug: \"${slug}\"`) || txt.includes(`slug: '${slug}'`);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Support both JSON and multipart/form-data (for image uploads)
    const contentType = (req.headers.get('content-type') || '');
  let fields: Partial<Fields> = {};
  let imagePath: string | undefined = undefined;

    if (contentType.startsWith('multipart/form-data')) {
      const form = await req.formData();
      fields.title = String(form.get('title') ?? '').trim();
      fields.slug = String(form.get('slug') ?? '').trim();
      fields.excerpt = String(form.get('excerpt') ?? '').trim();
      fields.author = String(form.get('author') ?? '').trim();
      fields.category = String(form.get('category') ?? '').trim();
      fields.content = String(form.get('content') ?? '').trim();
      fields.featured = String(form.get('featured') ?? 'false') === 'true';

      const maybeFile = form.get('image');
      // FormData file in Next request is a Blob/File-like object with arrayBuffer()
      if (maybeFile && typeof (maybeFile as Blob).arrayBuffer === 'function') {
        const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const arrayBuffer = await (maybeFile as Blob).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // try to read a filename if available (File exposes `name`)
        let originalName = '';
        if (typeof maybeFile === 'object' && maybeFile !== null) {
          const mf = maybeFile as { name?: unknown };
          if (typeof mf.name === 'string') originalName = mf.name;
        }
        const ext = path.extname(originalName) || '.png';
        const slugCandidate = safeSlug(fields.slug || fields.title || 'image');
        const filename = `${slugCandidate}${ext}`;
        const outPath = path.join(UPLOAD_DIR, filename);
        await fs.writeFile(outPath, buffer);
        imagePath = `/uploads/${filename}`;
      }
    } else {
      fields = (await req.json()) as NewPostReq & { featured?: boolean };
    }

    if (!fields.title || !fields.slug || !fields.excerpt || !fields.author || !fields.category || !fields.content) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const slug = safeSlug(fields.slug);
    if (!slug) return NextResponse.json({ message: 'Invalid slug' }, { status: 400 });

    // check for duplicates (local file + supabase if configured)
    if (await postsContainSlug(slug)) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }
    // also check supabase
    try {
      const supabase = createSupabaseClient();
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data: existing } = await supabase.from('posts').select('slug').eq('slug', slug).limit(1);
        if (existing && Array.isArray(existing) && existing.length) {
          return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
        }
      }
    } catch (e) {
      // ignore supabase check failures and continue
      console.error('supabase duplicate check failed', e);
    }

    // write MDX file (include image and featured if provided)
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
    try {
      await fs.mkdir(CONTENT_DIR, { recursive: true });
      const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
      let frontmatter = `---\ntitle: "${(fields.title as string).replace(/\"/g, '\\"')}"\nauthor: "${(fields.author as string).replace(/\"/g, '\\"')}"\ndate: "${dateStr}"\ncategory: "${(fields.category as string).replace(/\"/g, '\\"')}"`;
      if (imagePath) frontmatter += `\nimage: "${imagePath}"`;
      if (fields.featured) frontmatter += `\nfeatured: true`;
      frontmatter += `\n---\n\n`;
      const mdx = `${frontmatter}${(fields.content as string)}\n`;
      await fs.writeFile(mdxPath, mdx, 'utf8');
    } catch (writeErr) {
      console.error('failed to write MDX', writeErr);
      return NextResponse.json({ message: 'Failed to write post content', error: String(writeErr) }, { status: 500 });
    }

    // append to data/posts.ts by inserting before the closing ];
    const postsTxt = await fs.readFile(POSTS_FILE, 'utf8');
    const insertIndex = postsTxt.lastIndexOf('];');
    if (insertIndex === -1) {
      return NextResponse.json({ message: 'posts file malformed' }, { status: 500 });
    }

  // create object string
  const date = dateStr;
  const imageField = imagePath ? `    image: \"${imagePath}\",\n` : '';
  const featuredField = fields.featured ? `    featured: true,\n` : '';
  const obj = `  {\n    slug: \"${slug}\",\n    title: \"${fields.title.replace(/\"/g, '\\"')}\",\n    excerpt: \"${fields.excerpt.replace(/\"/g, '\\"')}\",\n    author: \"${fields.author.replace(/\"/g, '\\"')}\",\n    date: \"${date}\",\n    category: \"${fields.category.replace(/\"/g, '\\"')}\",\n${imageField}${featuredField}    contentPath: \"content/${slug}.mdx\",\n  },\n`;

    try {
      const newTxt = postsTxt.slice(0, insertIndex) + obj + postsTxt.slice(insertIndex);
      await fs.writeFile(POSTS_FILE, newTxt, 'utf8');
    } catch (writeErr) {
      console.error('failed to update posts.ts', writeErr);
      return NextResponse.json({ message: 'Failed to persist post metadata locally', error: String(writeErr) }, { status: 500 });
    }

    // try inserting metadata into Supabase (non-blocking)
    try {
      const supabase = createSupabaseClient();
      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const insert = {
          slug,
          title: fields.title,
          excerpt: fields.excerpt,
          author: fields.author,
          date,
          category: fields.category,
          contentPath: `content/${slug}.mdx`,
          image: imagePath ?? null,
          featured: fields.featured ?? false,
        };
        const { error } = await supabase.from('posts').insert(insert);
        if (error) console.error('supabase insert error', error);
      }
    } catch (e) {
      console.error('supabase insert failed', e);
    }

    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (err) {
    // surface the error in dev logs to help debugging and return details in non-prod
    console.error('admin add-post error:', err);
    const payload: { message: string; error?: string } = { message: 'Server error' };
    if (process.env.NODE_ENV !== 'production') payload.error = String(err);
    return NextResponse.json(payload, { status: 500 });
  }
}
