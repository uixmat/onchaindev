"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { EthIcon } from "@/components/icons/eth";
import { PageTransition } from "@/components/page-transition";
import {
  PortfolioStats,
  TraitDistribution,
} from "@/components/portfolio-analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NFTData {
  tokenId: string;
  name: string;
  contract: string;
  collection: string;
  image: string;
  rank?: number;
  traits: Array<{ traitType: string; value: string; rarity?: number }>;
  lastSale?: number;
  listPrice?: number | null;
  floorPrice?: number;
}

interface PageProps {
  params: Promise<{ address: string }>;
}

const GRID_COUNT = 12;

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
                This wallet doesn&apos;t have any NFTs.
              </p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          )}

          {/* Main content */}
          {!error && (loading || nfts.length > 0) && (
            <div className="space-y-6">
              {/* Stats Row */}
              {!loading && <PortfolioStats nfts={nfts} />}

              {/* Trait Distribution (full width) */}
              {!loading && (
                <Card>
                  <CardHeader>
                    <CardTitle>Trait Distribution</CardTitle>
                    <CardDescription>
                      Aggregated traits across {totalCount} NFTs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TraitDistribution nfts={nfts} />
                  </CardContent>
                </Card>
              )}

              {/* NFT Grid (full width) */}
              <div>
                <h2 className="mb-4 font-semibold text-xl">Collection</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {loading
                    ? Array.from({ length: GRID_COUNT }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                        <CardSkeleton key={`skel-${i}`} />
                      ))
                    : nfts.map((nft) => (
                        <Link
                          href={`/token/${nft.contract}/${nft.tokenId}`}
                          key={`${nft.contract}-${nft.tokenId}`}
                        >
                          <motion.div
                            className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                            whileHover={{
                              scale: 1.03,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              },
                            }}
                          >
                            <div className="aspect-square overflow-hidden bg-muted">
                              {nft.image ? (
                                <Image
                                  alt={nft.name}
                                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  height={500}
                                  loading="lazy"
                                  src={nft.image}
                                  width={500}
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div className="space-y-1 p-4">
                              <p className="truncate font-medium text-sm">
                                {nft.name}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="truncate text-muted-foreground text-xs">
                                  {nft.collection}
                                </p>
                                {nft.floorPrice && (
                                  <p className="flex items-center gap-0.5 font-mono text-xs">
                                    <EthIcon height="10px" />
                                    {nft.floorPrice}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
}
