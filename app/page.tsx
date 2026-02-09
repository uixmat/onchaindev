import { PageTransition } from "@/components/page-transition";
import { TrendingGrid } from "@/components/trending-grid";
import { WalletInput } from "@/components/wallet-input";

export default function Home() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="border-b px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-bold text-5xl tracking-tight">
            Explore any wallet
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            View NFT portfolios, track collections, and discover trending tokens
            across the blockchain.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <WalletInput />
            <p className="mt-2 text-muted-foreground text-xs">
              Try: vitalik.eth or any Ethereum address
            </p>
          </div>
        </div>
      </section>

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
