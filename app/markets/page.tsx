import ArticleCard from "../../components/ArticleCard";
import ListingLayout from "../../components/ListingLayout";
import { posts } from "../../data/posts";

export const metadata = {
  title: "Markets — CryptoBlog",
  description: "Latest market news and price analysis for cryptocurrencies.",
  openGraph: {
    title: "Markets — CryptoBlog",
    description: "Latest market news and price analysis for cryptocurrencies.",
  },
};

export default function MarketsPage() {
  const items = posts.filter((p) => p.category.toLowerCase() === "markets");

  return (
    <ListingLayout title="Markets">
      {items.length ? items.map((p) => <ArticleCard key={p.slug} post={p} />) : <p>No market posts yet.</p>}
    </ListingLayout>
  );
}
