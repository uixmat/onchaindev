"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { motion } from "motion/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { EthIcon } from "@/components/icons/eth";
import { NftMedia } from "@/components/nft-media";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

interface CollectionInfo {
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  opensea_url: string;
}

interface ListingAsset {
  token_id: string;
  image_url?: string | null;
  image_preview_url?: string | null;
  display_image_url?: string | null;
  display_animation_url?: string | null;
  name: string | null;
  asset_contract?: { address: string };
  collection?: { collection?: string; name?: string };
}

interface EnrichedNft {
  contract: string;
  tokenId: string;
  name: string | null;
  image: string;
  animation_url?: string | null;
}

interface ListingItem {
  order_hash: string;
  chain: string;
  remaining_quantity: number;
  price: { current: { currency: string; decimals: number; value: string } };
  status: string;
  maker_asset_bundle?: { assets?: ListingAsset[] };
  /** Populated by API from getNFTDetail when protocol_data has token info */
  nft?: EnrichedNft;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function CardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-square" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function formatPrice(value: string, decimals: number): string {
  const num = Number(value) / 10 ** decimals;
  return num >= 1 ? num.toFixed(2) : num.toFixed(4);
}

const SKELETON_KEYS = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

/** Prefer video (animation_url), then image — same as trending/homepage. */
function getMediaUrl(
  asset: ListingAsset | undefined,
  nft: EnrichedNft | undefined
): string | null {
  if (nft?.animation_url) {
    return nft.animation_url;
  }
  if (nft?.image) {
    return nft.image;
  }
  if (!asset) {
    return null;
  }
  return (
    asset.display_animation_url ??
    asset.display_image_url ??
    asset.image_url ??
    asset.image_preview_url ??
    null
  );
}

function ListingCard({
  listing,
  index,
}: {
  listing: ListingItem;
  index: number;
}) {
  const asset = listing.maker_asset_bundle?.assets?.[0];
  const nft = listing.nft;
  const contract = nft?.contract ?? asset?.asset_contract?.address;
  const tokenId = nft?.tokenId ?? asset?.token_id;
  const mediaUrl = getMediaUrl(asset, nft);
  const name = nft?.name ?? asset?.name ?? `#${tokenId ?? "—"}`;
  const price = listing.price?.current;
  const priceStr =
    price != null ? formatPrice(price.value, price.decimals) : null;
  const hasLink = Boolean(contract && tokenId);
  const currencySuffix =
    price?.currency && price.currency !== "ETH" ? ` ${price.currency}` : null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link
        href={hasLink ? `/token/${contract}/${tokenId}` : "#"}
        className={hasLink ? "" : "pointer-events-none"}
      >
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
          <div className="aspect-square overflow-hidden bg-muted">
            {mediaUrl ? (
              <NftMedia
                alt={name}
                className="size-full object-cover transition-transform duration-300 hover:scale-105"
                height={300}
                src={mediaUrl}
                width={300}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
          </div>
          <CardContent className="space-y-1 p-3">
            <p className="truncate font-medium text-sm">{name}</p>
            {priceStr != null && (
              <p className="flex items-center gap-1 font-mono text-sm">
                <EthIcon height="12px" />
                {priceStr}
                {currencySuffix}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function CollectionPage({ params }: PageProps) {
  const { slug } = use(params);
  const [nextCursor, setNextCursor] = useQueryState("next", { defaultValue: null });
  const [collection, setCollection] = useState<CollectionInfo | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = new URL(`/api/collection/${encodeURIComponent(slug)}/listings`, window.location.origin);
    url.searchParams.set("limit", String(PAGE_SIZE));
    if (nextCursor != null && nextCursor !== "") {
      url.searchParams.set("next", nextCursor);
    }
    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCollection(data.collection ?? null);
          setListings(data.listings ?? []);
          setNext(data.next ?? null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load collection");
        setLoading(false);
      });
  }, [slug, nextCursor]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SKELETON_KEYS.slice(0, PAGE_SIZE).map((key) => (
            <CardSkeleton key={key} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <h1 className="font-bold text-3xl">Collection not found</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const title = collection?.name ?? decodeURIComponent(slug);
  const description = collection?.description ?? undefined;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </div>
        </div>

        {listings.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No listings</CardTitle>
              <CardDescription>
                There are no active listings for this collection right now.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing, index) => (
                <ListingCard
                  index={index}
                  key={listing.order_hash}
                  listing={listing}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                disabled={nextCursor == null || nextCursor === ""}
                size="sm"
                variant="outline"
                onClick={() => setNextCursor(null)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                disabled={!next}
                size="sm"
                variant="outline"
                onClick={() => {
                  if (next) {
                    setNextCursor(next);
                  }
                }}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
