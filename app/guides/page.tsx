import ArticleCard from "../../components/ArticleCard";
import ListingLayout from "../../components/ListingLayout";
import { posts } from "../../data/posts";

export const metadata = {
  title: "Guides — CryptoBlog",
  description: "How-to guides and tutorials for building and using blockchain apps.",
  openGraph: {
    title: "Guides — CryptoBlog",
    description: "How-to guides and tutorials for building and using blockchain apps.",
  },
};

export default function GuidesPage() {
  const items = posts.filter((p) => p.category.toLowerCase() === "guides");

  return (
    <ListingLayout title="Guides">
      {items.length ? items.map((p) => <ArticleCard key={p.slug} post={p} />) : <p>No guides yet.</p>}
    </ListingLayout>
  );
}
