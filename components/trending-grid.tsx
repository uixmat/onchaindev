"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingNFT {
  contract: {
    address: string;
    name?: string;
    openSeaMetadata?: { collectionName?: string; imageUrl?: string };
  };
  tokenId: string;
  name?: string;
  image?: { cachedUrl?: string; thumbnailUrl?: string };
}

const GRID_COUNT = 12;

export function TrendingGrid() {
  const [nfts, setNfts] = useState<TrendingNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/trending")
      .then((res) => res.json())
      .then((data) => {
        setNfts(data.nfts || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load trending NFTs");
        setLoading(false);
      });
  }, []);

  if (error) {
    return <p className="text-center text-muted-foreground">{error}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: loading ? GRID_COUNT : nfts.length }).map(
        (_, index) => {
          if (loading) {
            return (
              <div
                className="overflow-hidden rounded-xl border"
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                key={`skeleton-${index}`}
              >
                <Skeleton className="aspect-square" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            );
          }

          const nft = nfts[index];
          const imageUrl = nft.image?.cachedUrl || nft.image?.thumbnailUrl;
          const name = nft.name || `#${nft.tokenId}`;
          const collection =
            nft.contract.openSeaMetadata?.collectionName ||
            nft.contract.name ||
            "Unknown";

          return (
            <Link
              href={`/token/${nft.contract.address}/${nft.tokenId}`}
              key={`${nft.contract.address}-${nft.tokenId}`}
            >
              <motion.div
                animate={{ opacity: 1 }}
                className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
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
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-4">
                  <p className="truncate font-medium text-sm">{name}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {collection}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        }
      )}
    </div>
  );
}
