import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoBlog",
  description: "News-style blog about crypto and Web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--color-background) text-(--color-foreground)`}
      >
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-100 bg-(--color-background) px-6 py-8 text-sm text-zinc-600 dark:border-zinc-800">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div>© {new Date().getFullYear()} CryptoBlog — News & analysis</div>
                <div className="flex gap-4">
                  <a href="#" className="hover:underline">About</a>
                  <a href="#" className="hover:underline">Contact</a>
                  <a href="#" className="hover:underline">Privacy</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
