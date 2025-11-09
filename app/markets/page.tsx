import ArticleCard from "../../components/ArticleCard";
import ListingLayout from "../../components/ListingLayout";
  import { getPosts } from "../../lib/posts";

export const metadata = {
  title: "Markets — CryptoBlog",
  description: "Latest market news and price analysis for cryptocurrencies.",
  openGraph: {
    title: "Markets — CryptoBlog",
    description: "Latest market news and price analysis for cryptocurrencies.",
  },
};

  export default async function MarketsPage() {
    const posts = await getPosts();
    const items = posts.filter((p) => p.category.toLowerCase() === "markets");

  return (
    <ListingLayout title="Markets">
      {items.length ? items.map((p) => <ArticleCard key={p.slug} post={p} />) : <p>No market posts yet.</p>}
    </ListingLayout>
  );
}
