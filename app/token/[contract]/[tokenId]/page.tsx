"use client";

import { ArrowLeft, Award, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { EthIcon } from "@/components/icons/eth";
import { PageTransition } from "@/components/page-transition";
import { PriceHistoryChart } from "@/components/price-history-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NFTDetailResponse {
  nft: {
    tokenId: string;
    name: string;
    contract: string;
    collection: string;
    image: string;
    rank?: number;
    traits: Array<{ traitType: string; value: string; rarity?: number }>;
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

export default function TokenDetailPage({ params }: PageProps) {
  const { contract, tokenId } = use(params);
  const [data, setData] = useState<NFTDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Floor Price</p>
                <p className="flex items-center gap-1 font-mono font-semibold">
                  <EthIcon height="14px" />
                  {collection.floorPrice}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Total Volume</p>
                <p className="flex items-center gap-1 font-mono font-semibold">
                  <EthIcon height="14px" />
                  {(collection.totalVolume / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Owners</p>
                <p className="font-mono font-semibold">
                  {collection.owners.toLocaleString()}{" "}
                  <span className="text-muted-foreground text-xs">
                    ({collection.ownerPercentage}%)
                  </span>
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Supply</p>
                <p className="font-mono font-semibold">
                  {collection.totalSupply.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Listed</p>
                <p className="font-mono font-semibold">
                  {collection.listedPercentage}%
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[500px_1fr]">
            {/* Image */}
            <div className="overflow-hidden rounded-xl border">
              {nft.image ? (
                // biome-ignore lint/performance/noImgElement: external NFT
                // biome-ignore lint/correctness/useImageSize: sized by parent
                <img
                  alt={nft.name}
                  className="aspect-square w-full object-cover"
                  src={nft.image}
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-muted-foreground text-sm">Token ID</p>
                    <p className="font-mono">{nft.tokenId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Collection</p>
                    <p>{nft.collection}</p>
                  </div>
                  {collection?.mintedDate && (
                    <div>
                      <p className="text-muted-foreground text-sm">Minted</p>
                      <p>
                        {new Date(collection.mintedDate).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}
                      </p>
                    </div>
                  )}
                  {nft.floorPrice && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Floor Price
                      </p>
                      <p className="flex items-center gap-1 font-mono font-semibold">
                        <EthIcon height="14px" />
                        {nft.floorPrice}
                      </p>
                    </div>
                  )}
                  {nft.lastSale && (
                    <div>
                      <p className="text-muted-foreground text-sm">Last Sale</p>
                      <p className="flex items-center gap-1 font-mono font-semibold">
                        <EthIcon height="14px" />
                        {nft.lastSale}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-sm">Contract</p>
                    <p className="break-all font-mono text-xs">
                      {nft.contract}
                    </p>
                  </div>
                  {nft.owner && (
                    <div>
                      <p className="text-muted-foreground text-sm">Owner</p>
                      <p className="break-all font-mono text-xs">{nft.owner}</p>
                    </div>
                  )}
                  {nft.description && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Description
                      </p>
                      <p className="text-sm">{nft.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {traits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Traits</CardTitle>
                    <CardDescription>
                      {traits.length} attributes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {traits.map((trait) => (
                        <div
                          className="flex items-center justify-between rounded-lg border px-3 py-2 transition-colors hover:bg-muted/50"
                          key={`${trait.traitType}-${trait.value}`}
                        >
                          <span className="text-muted-foreground text-xs uppercase">
                            {trait.traitType}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {trait.value}
                            </span>
                            {trait.rarity && (
                              <span className="text-muted-foreground text-xs">
                                {trait.rarity}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
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
