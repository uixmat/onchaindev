"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface NFTData {
  contract: {
    address: string;
    name?: string;
    openSeaMetadata?: {
      collectionName?: string;
      imageUrl?: string;
      floorPrice?: number;
    };
  };
  tokenId: string;
  name?: string;
  image?: { cachedUrl?: string; thumbnailUrl?: string };
}

interface PageProps {
  params: Promise<{ address: string }>;
}

const GRID_COUNT = 12;

function NFTCard({ nft }: { nft: NFTData }) {
  const imageUrl = nft.image?.cachedUrl || nft.image?.thumbnailUrl;
  const name = nft.name || `#${nft.tokenId}`;
  const collection =
    nft.contract.openSeaMetadata?.collectionName ||
    nft.contract.name ||
    "Unknown";

  return (
    <Link href={`/token/${nft.contract.address}/${nft.tokenId}`}>
      <motion.div
        className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
        whileHover={{
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        }}
      >
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            /* biome-ignore lint/performance/noImgElement: external NFT images */
            /* biome-ignore lint/correctness/useImageSize: sized by parent */
            <img
              alt={name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              src={imageUrl}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="space-y-1 p-4">
          <p className="truncate font-medium text-sm">{name}</p>
          <p className="truncate text-muted-foreground text-xs">{collection}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-square" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function PortfolioPage({ params }: PageProps) {
  const { address } = use(params);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/nfts/${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setNfts(data.nfts || []);
          setTotalCount(data.totalCount || 0);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load portfolio");
        setLoading(false);
      });
  }, [address]);

  return (
    <>
      {/* Sub-header */}
      <div className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Button
            onClick={() => window.history.back()}
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-xl">Portfolio</h1>
            <p className="font-mono text-muted-foreground text-sm">{address}</p>
          </div>
          {!(loading || error) && nfts.length > 0 && (
            <div className="ml-auto">
              <p className="font-semibold text-lg">{totalCount} NFTs</p>
            </div>
          )}
        </div>
      </div>

      <PageTransition>
        <div className="mx-auto max-w-7xl p-6">
          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <h2 className="font-bold text-2xl">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!(loading || error) && nfts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <h2 className="font-bold text-2xl">No NFTs Found</h2>
              <p className="text-muted-foreground">
                This wallet doesn&apos;t have any NFTs on Ethereum mainnet.
              </p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          )}

          {/* Grid: skeletons while loading, real cards when resolved (no animation on swap) */}
          {!error && (loading || nfts.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {loading
                ? Array.from({ length: GRID_COUNT }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                    <CardSkeleton key={`skel-${i}`} />
                  ))
                : nfts.map((nft) => (
                    <NFTCard
                      key={`${nft.contract.address}-${nft.tokenId}`}
                      nft={nft}
                    />
                  ))}
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
}
