"use client";

import {
  ArrowLeft,
  Award,
  Coins,
  ExternalLink,
  Layers,
  LayoutGrid,
  LayoutList,
  Loader2,
  Percent,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { HoloCard } from "@/components/holo-card";
import { EthIcon } from "@/components/icons/eth";
import { PageTransition } from "@/components/page-transition";
import { PriceHistoryChart } from "@/components/price-history-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEthPrice } from "@/hooks/use-eth-price";

const RARITY_BADGE_VARIANTS = ["purple", "blue", "emerald"] as const;

interface NFTDetailResponse {
  nft: {
    tokenId: string;
    name: string;
    contract: string;
    collection: string;
    image: string;
    rank?: number;
    traits: Array<{
      traitType: string;
      value: string;
      rarity?: number;
      count?: number;
      ethValue?: number;
    }>;
    lastSale?: number;
    listPrice?: number | null;
    owner?: string;
    description?: string;
    floorPrice?: number;
  };
  collection?: {
    name: string;
    creator: string;
    mintedDate: string;
    totalSupply: number;
    floorPrice: number;
    totalVolume: number;
    owners: number;
    ownerPercentage: number;
    listedPercentage: number;
  } | null;
  priceHistory: Array<{ date: string; price: number }>;
  sales: Array<{ date: string; price: number; marketplace: string }>;
}

interface PageProps {
  params: Promise<{ contract: string; tokenId: string }>;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: page with multiple sections
export default function TokenDetailPage({ params }: PageProps) {
  const { contract, tokenId } = use(params);
  const [data, setData] = useState<NFTDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traitsLayout, setTraitsLayout] = useState<"grid" | "list">("grid");
  const ethPrice = useEthPrice();

  useEffect(() => {
    fetch(`/api/nft-detail/${contract}/${tokenId}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load token details");
        setLoading(false);
      });
  }, [contract, tokenId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-muted-foreground">Loading token...</span>
      </div>
    );
  }

  if (error || !data?.nft) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-3xl">Token Not Found</h1>
        <p className="text-muted-foreground">
          {error || "This token could not be found."}
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const { nft, collection, priceHistory, sales } = data;
  const traits = nft.traits || [];

  const formatUsd = (eth: number) =>
    ethPrice
      ? `~$${(eth * ethPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : null;

  return (
    <>
      {/* Sub-header */}
      <div className="border-b bg-background/30 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6">
          <Button
            onClick={() => window.history.back()}
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-xl">{nft.name}</h1>
              {nft.rank && (
                <Badge className="gap-1" variant="secondary">
                  <Award className="size-3" />
                  Rank #{nft.rank}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {nft.collection}
              {collection?.creator && <span> by {collection.creator}</span>}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <a
              href={`https://opensea.io/assets/ethereum/${contract}/${tokenId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-3" />
              OpenSea
            </a>
          </Button>
        </div>
      </div>

      <PageTransition>
        <div className="mx-auto max-w-7xl p-6">
          {/* Collection Stats Bar */}
          {collection && (
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
              <Card className="py-4">
                <CardContent className="flex items-center gap-3 px-4 py-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Coins className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1 font-bold font-mono text-2xl">
                      <EthIcon height="18px" />
                      {collection.floorPrice}
                    </p>
                    <p className="text-muted-foreground text-xs">Floor Price</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent className="flex items-center gap-3 px-4 py-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1 font-bold font-mono text-2xl">
                      <EthIcon height="18px" />
                      {(collection.totalVolume / 1000).toFixed(0)}K
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Total Volume
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent className="flex items-center gap-3 px-4 py-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl">
                      {collection.owners.toLocaleString()}{" "}
                      <span className="font-normal text-muted-foreground text-xs">
                        ({collection.ownerPercentage}%)
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">Owners</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent className="flex items-center gap-3 px-4 py-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl">
                      {collection.totalSupply.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-xs">Supply</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent className="flex items-center gap-3 px-4 py-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Percent className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl">
                      {collection.listedPercentage}%
                    </p>
                    <p className="text-muted-foreground text-xs">Listed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[500px_1fr]">
            <div>
              {/* Image */}
              <div className="" style={{ perspective: 1200 }}>
                {nft.image ? (
                  <motion.div
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      rotateX: 0,
                      y: 0,
                    }}
                    initial={{
                      filter: "blur(3px)",
                      opacity: 0,
                      rotateX: 8,
                      y: 60,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    transition={{
                      delay: 0.2,
                      duration: 0.9,
                      ease: [0.85, 0, 0.15, 1],
                    }}
                  >
                    <HoloCard>
                      <Image
                        alt={nft.name}
                        className="aspect-square w-full object-cover"
                        height={500}
                        src={nft.image}
                        width={500}
                      />
                    </HoloCard>
                  </motion.div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  {((nft.floorPrice !== undefined && nft.floorPrice !== null) ||
                    (nft.lastSale !== undefined && nft.lastSale !== null)) && (
                    <div className="flex flex-wrap gap-6">
                      {nft.floorPrice != null && (
                        <div>
                          <p className="text-muted-foreground text-xs uppercase">
                            Floor Price
                          </p>
                          <p className="flex items-baseline gap-1.5 font-mono font-semibold text-lg">
                            <EthIcon height="18px" />
                            {nft.floorPrice}
                            {formatUsd(nft.floorPrice) && (
                              <span className="font-normal text-muted-foreground text-xs">
                                {formatUsd(nft.floorPrice)}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      {nft.lastSale != null && (
                        <div>
                          <p className="text-muted-foreground text-xs uppercase">
                            Last Sale
                          </p>
                          <p className="flex items-baseline gap-1.5 font-mono font-semibold text-lg">
                            <EthIcon height="18px" />
                            {nft.lastSale}
                            {formatUsd(nft.lastSale) && (
                              <span className="font-normal text-muted-foreground text-xs">
                                {formatUsd(nft.lastSale)}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 rounded-t-xl bg-linear-to-b from-border/50 to-transparent py-6 pb-0">
                  <div className="space-y-px">
                    <div className="flex items-center justify-between py-1.5">
                      <p className="text-muted-foreground text-sm">Token ID</p>
                      <p className="font-mono text-muted-foreground text-sm">
                        {nft.tokenId}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <p className="text-muted-foreground text-sm">
                        Collection
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {nft.collection}
                      </p>
                    </div>
                    {collection?.mintedDate && (
                      <div className="flex items-center justify-between py-1.5">
                        <p className="text-muted-foreground text-sm">Minted</p>
                        <p className="text-muted-foreground text-sm">
                          {new Date(collection.mintedDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-1.5">
                      <p className="text-muted-foreground text-sm">Contract</p>
                      <p className="break-all font-mono text-muted-foreground text-sm">
                        {nft.contract}
                      </p>
                    </div>
                    {nft.owner && (
                      <div className="flex items-center justify-between py-1.5">
                        <p className="text-muted-foreground text-sm">Owner</p>
                        <p className="break-all font-mono text-muted-foreground text-sm">
                          {nft.owner}
                        </p>
                      </div>
                    )}
                  </div>
                  {nft.description && (
                    <div className="flex flex-col gap-2 py-3">
                      <p className="text-muted-foreground text-sm">
                        Description
                      </p>
                      <p className="text-card-foreground text-sm">
                        {nft.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {traits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Traits</CardTitle>
                    <CardDescription>TRAITS {traits.length}</CardDescription>
                    <CardAction>
                      <ToggleGroup
                        onValueChange={(v: string | undefined) =>
                          v && setTraitsLayout(v as "grid" | "list")
                        }
                        size="sm"
                        type="single"
                        value={traitsLayout}
                        variant="outline"
                      >
                        <ToggleGroupItem aria-label="Grid view" value="grid">
                          <LayoutGrid className="size-3" />
                        </ToggleGroupItem>
                        <ToggleGroupItem aria-label="List view" value="list">
                          <LayoutList className="size-3" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={
                        traitsLayout === "grid"
                          ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                          : "flex flex-col gap-3"
                      }
                    >
                      {traits.map((trait, i) => {
                        const badgeVariant = RARITY_BADGE_VARIANTS[i % 3];
                        return (
                          <div
                            className={`flex flex-col gap-2 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50 ${
                              traitsLayout === "list"
                                ? "flex-row items-center justify-between"
                                : ""
                            }`}
                            key={`${trait.traitType}-${trait.value}`}
                          >
                            <div
                              className={
                                traitsLayout === "list"
                                  ? "flex flex-1 flex-col"
                                  : ""
                              }
                            >
                              <span className="text-muted-foreground text-xs uppercase">
                                {trait.traitType}
                              </span>
                              <p className="font-medium text-sm">
                                {trait.value}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {(trait.count != null ||
                                trait.rarity != null) && (
                                <Badge
                                  className="tabular-nums"
                                  variant={badgeVariant}
                                >
                                  {trait.count != null &&
                                    `${trait.count.toLocaleString()}`}
                                  {trait.count != null &&
                                    trait.rarity != null &&
                                    " · "}
                                  {trait.rarity != null && `${trait.rarity}%`}
                                </Badge>
                              )}
                              {trait.ethValue != null && (
                                <span className="flex items-center gap-0.5 font-mono text-sm">
                                  <EthIcon height="12px" />
                                  {trait.ethValue}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Price History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Price History</CardTitle>
              <CardDescription>
                {sales.length > 0
                  ? `${sales.length} sales over 90 days`
                  : "90-day price history"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceHistoryChart history={priceHistory} sales={sales} />
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </>
  );
}
