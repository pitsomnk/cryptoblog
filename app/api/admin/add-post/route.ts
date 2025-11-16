import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDatabase } from "../../../../lib/mongodb";

type NewPostReq = {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  content: string;
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
    return txt.includes(`slug: "${slug}"`) || txt.includes(`slug: '${slug}'`);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
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
      if (maybeFile && typeof (maybeFile as Blob).arrayBuffer === 'function') {
        const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const arrayBuffer = await (maybeFile as Blob).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
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

    // Check MongoDB for existing slug if configured
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        const existing = await db.collection('posts').findOne({ slug });
        if (existing) {
          return NextResponse.json({ message: 'Slug already exists in database' }, { status: 409 });
        }
      } catch (mongoErr) {
        console.error('MongoDB duplicate check error (continuing):', mongoErr);
      }
    }

    if (await postsContainSlug(slug)) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }

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

    const postsTxt = await fs.readFile(POSTS_FILE, 'utf8');
    const insertIndex = postsTxt.lastIndexOf('];');
    if (insertIndex === -1) {
      return NextResponse.json({ message: 'posts file malformed' }, { status: 500 });
    }

    const date = dateStr;
    const imageField = imagePath ? `    image: \"${imagePath}\",\n` : '';
    const featuredField = fields.featured ? `    featured: true,\n` : '';
    const obj = `  {\n    slug: \"${slug}\",\n    title: \"${fields.title.replace(/\"/g, '\\\"')}\",\n    excerpt: \"${fields.excerpt.replace(/\"/g, '\\\"')}\",\n    author: \"${fields.author.replace(/\"/g, '\\\"')}\",\n    date: \"${date}\",\n    category: \"${fields.category.replace(/\"/g, '\\\"')}\",\n${imageField}${featuredField}    contentPath: \"content/${slug}.mdx\",\n  },\n`;

    try {
      const newTxt = postsTxt.slice(0, insertIndex) + obj + postsTxt.slice(insertIndex);
      await fs.writeFile(POSTS_FILE, newTxt, 'utf8');
    } catch (writeErr) {
      console.error('failed to update posts.ts', writeErr);
      return NextResponse.json({ message: 'Failed to persist post metadata locally', error: String(writeErr) }, { status: 500 });
    }

    // Insert into MongoDB if configured
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        const postDoc = {
          slug,
          title: fields.title,
          excerpt: fields.excerpt,
          author: fields.author,
          date,
          category: fields.category,
          contentPath: `content/${slug}.mdx`,
          image: imagePath ?? null,
          featured: fields.featured ?? false,
          createdAt: new Date(),
        };
        await db.collection('posts').insertOne(postDoc);
      } catch (mongoErr) {
        console.error('MongoDB insert error (continuing):', mongoErr);
        // Don't fail the request if MongoDB insert fails - local file is already saved
      }
    }

    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (err) {
    console.error('admin add-post error:', err);
    const payload: { message: string; error?: string } = { message: 'Server error' };
    if (process.env.NODE_ENV !== 'production') payload.error = String(err);
    return NextResponse.json(payload, { status: 500 });
  }
}
