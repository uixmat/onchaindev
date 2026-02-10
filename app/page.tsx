import { Hero } from "@/components/hero";
import { PageTransition } from "@/components/page-transition";
import { TrendingGrid } from "@/components/trending-grid";

export default function Home() {
  return (
    <PageTransition>
      <Hero />

      {/* Trending */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 font-semibold text-2xl">Trending NFTs</h2>
          <TrendingGrid />
        </div>
      </section>
    </PageTransition>
  );
}
