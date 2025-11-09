import ArticleCard from "../../components/ArticleCard";
import ListingLayout from "../../components/ListingLayout";
import { posts } from "../../data/posts";

export const metadata = {
  title: "Analysis — CryptoBlog",
  description: "In-depth analysis and research on blockchain protocols and tokens.",
  openGraph: {
    title: "Analysis — CryptoBlog",
    description: "In-depth analysis and research on blockchain protocols and tokens.",
  },
};

export default function AnalysisPage() {
  const items = posts.filter((p) => p.category.toLowerCase() === "analysis");

  return (
    <ListingLayout title="Analysis">
      {items.length ? items.map((p) => <ArticleCard key={p.slug} post={p} />) : <p>No analysis posts yet.</p>}
    </ListingLayout>
  );
}
