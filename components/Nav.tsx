import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-zinc-100 bg-(--color-background)">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          CryptoBlog
        </Link>
        <nav className="hidden gap-6 text-sm font-medium sm:flex">
          <Link href="/markets" className="hover:underline">Markets</Link>
          <Link href="/analysis" className="hover:underline">Analysis</Link>
          <Link href="/guides" className="hover:underline">Guides</Link>
          <Link href="/newsletter" className="hover:underline">Newsletter</Link>
        </nav>
      </div>
    </header>
  );
}
