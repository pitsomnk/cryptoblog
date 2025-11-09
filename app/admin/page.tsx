"use client";

import { useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Markets");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    if (!title || !slug || !excerpt || !author || !category || !content) {
      setMessage("Please fill all fields.");
      setStatus("error");
      return;
    }

    try {
      let res: Response;
      if (imageFile) {
        const fd = new FormData();
        fd.append('title', title);
        fd.append('slug', slug);
        fd.append('excerpt', excerpt);
        fd.append('author', author);
        fd.append('category', category);
        fd.append('content', content);
        fd.append('featured', String(featured));
        fd.append('image', imageFile);

        res = await fetch('/api/admin/add-post', { method: 'POST', body: fd });
      } else {
        res = await fetch('/api/admin/add-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, excerpt, author, category, content, featured }),
        });
      }

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(body.message || 'Failed to create post');
        setStatus('error');
        return;
      }

      setStatus('success');
      setMessage('Post created — you can view it now.');
      // clear form
      setTitle(''); setSlug(''); setExcerpt(''); setAuthor(''); setCategory('Markets'); setContent(''); setImageFile(null); setFeatured(false);
    } catch {
      setMessage('Network error');
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Admin — Add story</h1>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full rounded-md border px-3 py-2" />
        <input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="slug-friendly-title (no spaces)" className="w-full rounded-md border px-3 py-2" />
        <input value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} placeholder="Excerpt" className="w-full rounded-md border px-3 py-2" />
        <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Author" className="w-full rounded-md border px-3 py-2" />

        <div className="flex gap-2">
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-md border px-3 py-2">
            <option>Markets</option>
            <option>Analysis</option>
            <option>Guides</option>
            <option>Policy</option>
            <option>Opinion</option>
          </select>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} className="h-4 w-4" />
            <span className="text-sm">Featured</span>
          </label>
        </div>

        <label className="text-sm font-medium">Hero image (optional)</label>
        <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files?.[0] ?? null)} />

        <label className="text-sm font-medium">Content (MDX)</label>
        <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={12} className="w-full rounded-md border px-3 py-2 font-mono text-sm" />

        <div className="flex items-center gap-4">
          <button type="submit" disabled={status==='loading'} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-95">Create post</button>
          {status==='loading' && <div>Creating...</div>}
          {message && <div className={`text-sm ${status==='error' ? 'text-red-600' : 'text-green-600'}`}>{message}</div>}
        </div>
      </form>
    </div>
  );
}
