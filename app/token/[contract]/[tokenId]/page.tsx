"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NFTDetail {
  contract: {
    address: string;
    name?: string;
    openSeaMetadata?: {
      collectionName?: string;
      floorPrice?: number;
      description?: string;
    };
  };
  tokenId: string;
  name?: string;
  description?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
  };
  raw?: {
    metadata?: {
      attributes?: Array<{ trait_type: string; value: string }>;
    };
  };
}

interface PageProps {
  params: Promise<{ contract: string; tokenId: string }>;
}

export default function TokenDetailPage({ params }: PageProps) {
  const { contract, tokenId } = use(params);
  const [nft, setNft] = useState<NFTDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/nft-detail/${contract}/${tokenId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setNft(data);
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

  if (error || !nft) {
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

  const imageUrl =
    nft.image?.cachedUrl || nft.image?.originalUrl || nft.image?.thumbnailUrl;
  const name = nft.name || `Token #${nft.tokenId}`;
  const collection =
    nft.contract.openSeaMetadata?.collectionName ||
    nft.contract.name ||
    "Unknown Collection";
  const traits = nft.raw?.metadata?.attributes || [];

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
            <h1 className="font-semibold text-xl">{name}</h1>
            <p className="text-muted-foreground text-sm">{collection}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <PageTransition>
        <div className="mx-auto max-w-7xl p-6">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* Image */}
            <div className="overflow-hidden rounded-xl border">
              {imageUrl ? (
                /* biome-ignore lint/performance/noImgElement: external NFT images */
                /* biome-ignore lint/correctness/useImageSize: sized by parent */
                <img
                  alt={name}
                  className="aspect-square w-full object-cover"
                  src={imageUrl}
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
                    <p>{collection}</p>
                  </div>
                  {nft.contract.openSeaMetadata?.floorPrice && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Floor Price
                      </p>
                      <p className="font-mono font-semibold">
                        {nft.contract.openSeaMetadata.floorPrice} ETH
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-sm">Contract</p>
                    <p className="break-all font-mono text-xs">
                      {nft.contract.address}
                    </p>
                  </div>
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
                    <div className="grid gap-3 sm:grid-cols-2">
                      {traits.map((trait) => (
                        <div
                          className="space-y-1 rounded-lg border p-3"
                          key={`${trait.trait_type}-${trait.value}`}
                        >
                          <p className="text-muted-foreground text-xs uppercase">
                            {trait.trait_type}
                          </p>
                          <p className="font-medium">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}
