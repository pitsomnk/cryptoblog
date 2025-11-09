export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  contentPath: string; // path to MDX file
};

export const posts: Post[] = [
  {
    slug: "bitcoin-halving-2024",
    title: "Bitcoin Halving: What to Expect in 2024",
    excerpt: "An overview of historical halvings and the likely market impact going into 2024.",
    author: "Alex Kim",
    date: "Nov 5, 2025",
    category: "Markets",
    contentPath: "content/bitcoin-halving-2024.mdx",
  },
  {
    slug: "eth-scaling-rollups",
    title: "How Rollups Are Reshaping Ethereum Scaling",
    excerpt: "A pragmatic look at optimistic and zk rollups and the trade-offs teams are considering.",
    author: "Sofia Martinez",
    date: "Nov 2, 2025",
    category: "Analysis",
    contentPath: "content/eth-scaling-rollups.mdx",
  },
  {
    slug: "web3-ux-guidelines",
    title: "Designing Better UX for Web3 Apps",
    excerpt: "Practical guidelines to lower friction for new users interacting with wallets and dApps.",
    author: "Priya Singh",
    date: "Oct 29, 2025",
    category: "Guides",
    contentPath: "content/web3-ux-guidelines.mdx",
  },
  {
    slug: "regulation-crypto-eu",
    title: "New EU Rules: What Startups Should Know",
    excerpt: "A summary of new regulatory changes and action items for founders and builders.",
    author: "Marco Rossi",
    date: "Oct 20, 2025",
    category: "Policy",
    contentPath: "content/regulation-crypto-eu.mdx",
  },
  {
    slug: "tduitu-hjgjbgk-hfhfv",
    title: "tufuoohj",
    excerpt: "gndsggil",
    author: "hyjfyg,/., p",
    date: "Nov 9, 2025",
    category: "Markets",
    image: "/uploads/tduitu-hjgjbgk-hfhfv.jpg",
    contentPath: "content/tduitu-hjgjbgk-hfhfv.mdx",
  },
];
