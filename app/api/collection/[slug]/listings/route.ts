import {
  getBestListingsByCollection,
  getCollection,
  getNFTDetail,
  type Chain,
  type OpenSeaNFT,
} from "@/lib/opensea";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 10;

/** Extract contract + tokenId from Seaport protocol_data.parameters (offer items). */
function extractTokenFromProtocolData(listing: {
  protocol_data?: { parameters?: Record<string, unknown> };
}): { contract: string; tokenId: string } | null {
  const params = listing.protocol_data?.parameters as Record<string, unknown> | undefined;
  if (!params || typeof params !== "object") {
    return null;
  }
  // Seaport: offer array with { itemType, token, identifierOrCriteria }
  // itemType 2 = ERC721, 3 = ERC1155
  const offer =
    (params.offer as Array<{ itemType?: number; token?: string; identifierOrCriteria?: string }> | undefined) ??
    (params.offers as Array<{ itemType?: number; token?: string; identifierOrCriteria?: string }> | undefined);
  if (!Array.isArray(offer) || offer.length === 0) {
    return null;
  }
  const nftOffer = offer.find(
    (item) => item?.itemType === 2 || item?.itemType === 3
  );
  if (!nftOffer?.token || nftOffer.identifierOrCriteria == null) {
    return null;
  }
  return {
    contract: nftOffer.token,
    tokenId: String(nftOffer.identifierOrCriteria),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam
    ? Math.min(Number.parseInt(limitParam, 10) || DEFAULT_LIMIT, MAX_LIMIT)
    : DEFAULT_LIMIT;

  try {
    const [collectionRes, listingsRes] = await Promise.allSettled([
      getCollection(slug),
      getBestListingsByCollection(slug, { limit, next }),
    ]);

    const collection =
      collectionRes.status === "fulfilled" ? collectionRes.value : null;
    const listings =
      listingsRes.status === "fulfilled" ? listingsRes.value : { listings: [] };

    // Debug: log full values (first listing and collection) for inspection
    if (listings.listings.length > 0) {
      const first = listings.listings[0];
      console.log("[collection/listings] first listing (full):", JSON.stringify(first, null, 2));
    }
    if (collection) {
      console.log("[collection/listings] collection (full):", JSON.stringify(collection, null, 2));
    }

    // Enrich each listing with NFT details (image, name, video) from getNFTDetail when protocol_data has token info
    const defaultChain = (collection?.contracts?.[0]?.chain ?? "ethereum") as Chain;
    const enriched = await Promise.all(
      listings.listings.map(async (listing) => {
        const extracted = extractTokenFromProtocolData(listing);
        if (!extracted) {
          return { ...listing, nft: undefined };
        }
        try {
          const { nft } = await getNFTDetail(
            (listing.chain as Chain) || defaultChain,
            extracted.contract,
            extracted.tokenId
          );
          if (!nft) {
            return { ...listing, nft: undefined };
          }
          const osNft = nft as OpenSeaNFT;
          const image =
            osNft.display_image_url || osNft.image_url || "";
          const animationUrl = osNft.display_animation_url ?? null;
          return {
            ...listing,
            nft: {
              contract: extracted.contract,
              tokenId: extracted.tokenId,
              name: osNft.name ?? null,
              image,
              animation_url: animationUrl,
            },
          };
        } catch {
          return { ...listing, nft: undefined };
        }
      })
    );

    return NextResponse.json({
      collection: collection
        ? {
            name: collection.name,
            description: collection.description,
            image_url: collection.image_url,
            banner_image_url: collection.banner_image_url,
            opensea_url: collection.opensea_url,
          }
        : null,
      listings: enriched,
      next: listings.next ?? null,
    });
  } catch (error) {
    console.error("Error fetching collection listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection listings" },
      { status: 500 }
    );
  }
}
