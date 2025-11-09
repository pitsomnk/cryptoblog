"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Subscription failed");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setError("Network error");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-md border border-zinc-100 p-6 text-center dark:border-zinc-800">
      <h3 className="mb-2 text-lg font-semibold">Subscribe to our newsletter</h3>
      <p className="mb-4 text-sm text-zinc-600">Weekly roundup of top crypto stories.</p>

      {status === "success" ? (
        <div className="text-sm text-green-600">Thanks — check your inbox!</div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing up..." : "Sign up"}
            </button>
            {error && <div className="ml-4 text-sm text-red-600">{error}</div>}
          </div>
        </form>
      )}
    </div>
  );
}
