import { MAYC_CONTRACT, maycCollection } from "./mock/collection";
import { getMockNFT, mockNFTs } from "./mock/nfts";
import type { PricePoint, SaleEvent } from "./mock/price-history";
import {
  generateCollectionPriceHistory,
  generateNFTSaleHistory,
} from "./mock/price-history";
import {
  getCollection,
  getCollectionNFTs,
  getCollectionStats,
  getEventsByCollection,
  getEventsByNFT,
  getNFTDetail,
  getNFTsByAccount,
  listCollections,
  type OpenSeaNFT,
} from "./opensea";

export type { CollectionData } from "./mock/collection";
export type { PricePoint, SaleEvent } from "./mock/price-history";

type MockNFT = import("./mock/nfts").MockNFT;
type CollectionData = import("./mock/collection").CollectionData;

const USE_MOCK = process.env.NEXT_PUBLIC_DATA_SOURCE !== "api";

// ---- Unified types ----

export interface NFTData {
  tokenId: string;
  name: string;
  contract: string;
  collection: string;
  collectionSlug?: string;
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
  openseaUrl?: string;
}

// ---- Helpers ----

function openSeaNFTToUnified(nft: OpenSeaNFT, floorPrice?: number): NFTData {
  return {
    tokenId: nft.identifier,
    name: nft.name || `#${nft.identifier}`,
    contract: nft.contract,
    collection: nft.collection,
    collectionSlug: nft.collection,
    image: nft.display_image_url || nft.image_url || "",
    rank: nft.rarity?.rank,
    traits: (nft.traits || []).map((t) => ({
      traitType: t.trait_type,
      value: t.value,
    })),
    description: nft.description ?? undefined,
    floorPrice,
    openseaUrl: nft.opensea_url,
    owner: nft.owners?.[0]?.address,
  };
}

// ---- Data fetchers ----

export async function fetchNFTsForAddress(address: string): Promise<{
  nfts: NFTData[];
  totalCount: number;
}> {
  if (USE_MOCK) {
    return {
      nfts: mockNFTs.map(toUnifiedNFT),
      totalCount: mockNFTs.length,
    };
  }

  const data = await getNFTsByAccount("ethereum", address, 50);

  const slugs = [...new Set(data.nfts.map((n) => n.collection))];
  const statsMap = new Map<string, number>();

  const statsResults = await Promise.allSettled(
    slugs.slice(0, 20).map(async (slug) => {
      const stats = await getCollectionStats(slug);
      return { slug, floor: stats.total.floor_price };
    })
  );
  for (const r of statsResults) {
    if (r.status === "fulfilled") {
      statsMap.set(r.value.slug, r.value.floor);
    }
  }

  const nfts = data.nfts
    .filter((n) => n.display_image_url || n.image_url)
    .map((n) => openSeaNFTToUnified(n, statsMap.get(n.collection)));

  return { nfts, totalCount: nfts.length };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: data fetching with fallbacks
export async function fetchNFTDetail(
  contract: string,
  tokenId: string
): Promise<{
  nft: NFTData | null;
  collection: CollectionData | null;
  priceHistory: PricePoint[];
  sales: SaleEvent[];
  relatedNfts: NFTData[];
}> {
  if (USE_MOCK) {
    const mock = getMockNFT(contract, tokenId);
    if (!mock) {
      return {
        nft: null,
        collection: null,
        priceHistory: [],
        sales: [],
        relatedNfts: [],
      };
    }
    const { history, sales } = generateNFTSaleHistory(tokenId);
    return {
      nft: toUnifiedNFT(mock),
      collection: maycCollection,
      priceHistory: history,
      sales,
      relatedNfts: [],
    };
  }

  try {
    const detail = await getNFTDetail("ethereum", contract, tokenId);
    const osNft = detail.nft;
    if (!osNft) {
      return {
        nft: null,
        collection: null,
        priceHistory: [],
        sales: [],
        relatedNfts: [],
      };
    }

    let floorPrice: number | undefined;
    let collectionData: CollectionData | null = null;

    const [statsRes, collRes] = await Promise.allSettled([
      getCollectionStats(osNft.collection),
      getCollection(osNft.collection),
    ]);

    if (statsRes.status === "fulfilled") {
      floorPrice = statsRes.value.total.floor_price;
    }

    if (collRes.status === "fulfilled") {
      const c = collRes.value;
      const stats =
        statsRes.status === "fulfilled" ? statsRes.value.total : null;
      collectionData = {
        contract,
        name: c.name,
        symbol: "",
        creator: c.owner,
        description: c.description,
        mintedDate: "",
        totalSupply: c.total_supply,
        floorPrice: floorPrice ?? 0,
        totalVolume: stats?.volume ?? 0,
        owners: stats?.num_owners ?? 0,
        ownerPercentage:
          stats && c.total_supply
            ? Math.round((stats.num_owners / c.total_supply) * 100 * 10) / 10
            : 0,
        listedPercentage: 0,
        imageUrl: c.image_url,
        bannerUrl: c.banner_image_url,
        externalUrl: c.project_url || c.opensea_url,
        traitCategories: [],
      };
    }

    const nft = openSeaNFTToUnified(osNft, floorPrice);

    const [nftEventsRes, collEventsRes] = await Promise.allSettled([
      getEventsByNFT("ethereum", contract, tokenId, "sale", 20),
      getEventsByCollection(osNft.collection, "sale", 200),
    ]);

    const nftSales: SaleEvent[] = [];
    if (nftEventsRes.status === "fulfilled") {
      for (const e of nftEventsRes.value.asset_events) {
        if (!e.payment?.quantity) {
          continue;
        }
        const price =
          Number(e.payment.quantity) / 10 ** (e.payment.decimals || 18);
        if (price > 0) {
          nftSales.push({
            date: new Date(e.event_timestamp * 1000),
            price: Number(price.toFixed(4)),
            marketplace: "OpenSea",
            from: e.seller,
            to: e.buyer,
          });
        }
      }
    }

    const priceHistory: PricePoint[] = [];
    if (collEventsRes.status === "fulfilled") {
      const raw = collEventsRes.value.asset_events
        .filter((e) => e.payment?.quantity)
        .map((e) => ({
          ts: e.event_timestamp,
          price: Number(e.payment.quantity) / 10 ** (e.payment.decimals || 18),
        }))
        .filter((e) => e.price > 0)
        .sort((a, b) => a.ts - b.ts);

      // Aggregate to daily averages
      const dailyMap = new Map<string, { total: number; count: number }>();
      for (const e of raw) {
        const day = new Date(e.ts * 1000).toISOString().split("T")[0];
        const existing = dailyMap.get(day);
        if (existing) {
          existing.total += e.price;
          existing.count += 1;
        } else {
          dailyMap.set(day, { total: e.price, count: 1 });
        }
      }

      // Fill gaps: every day from first to last gets a point
      const sortedDays = [...dailyMap.keys()].sort();
      if (sortedDays.length >= 2) {
        const DAY_MS = 24 * 60 * 60 * 1000;
        const first = new Date(sortedDays[0]);
        const lastDay = sortedDays.at(-1) ?? sortedDays[0];
        const last = new Date(lastDay);
        const totalDays = Math.round(
          (last.getTime() - first.getTime()) / DAY_MS
        );

        let lastPrice = 0;
        for (let d = 0; d <= totalDays; d++) {
          const date = new Date(first.getTime() + d * DAY_MS);
          const key = date.toISOString().split("T")[0];
          const entry = dailyMap.get(key);
          if (entry) {
            lastPrice = Number((entry.total / entry.count).toFixed(4));
          }
          priceHistory.push({ date, price: lastPrice });
        }
      } else {
        for (const [key, v] of dailyMap) {
          priceHistory.push({
            date: new Date(key),
            price: Number((v.total / v.count).toFixed(4)),
          });
        }
      }
    }

    let relatedNfts: NFTData[] = [];
    try {
      const related = await getCollectionNFTs(osNft.collection, 8);
      relatedNfts = related.nfts
        .filter(
          (n) =>
            n.identifier !== tokenId && (n.display_image_url || n.image_url)
        )
        .slice(0, 6)
        .map((n) => openSeaNFTToUnified(n, floorPrice));
    } catch {
      // non-critical
    }

    return {
      nft,
      collection: collectionData,
      priceHistory,
      sales: nftSales.sort((a, b) => a.date.getTime() - b.date.getTime()),
      relatedNfts,
    };
  } catch (err) {
    console.error("fetchNFTDetail error:", err);
    return {
      nft: null,
      collection: null,
      priceHistory: [],
      sales: [],
      relatedNfts: [],
    };
  }
}

export async function fetchTrendingNFTs(): Promise<NFTData[]> {
  if (USE_MOCK) {
    return [...mockNFTs].sort(() => Math.random() - 0.5).map(toUnifiedNFT);
  }

  const { collections } = await listCollections("seven_day_volume", 8);

  const results = await Promise.allSettled(
    collections.map(async (col) => {
      const [nftsRes, statsRes] = await Promise.allSettled([
        getCollectionNFTs(col.collection, 4),
        getCollectionStats(col.collection),
      ]);
      const nfts = nftsRes.status === "fulfilled" ? nftsRes.value.nfts : [];
      const floor =
        statsRes.status === "fulfilled"
          ? statsRes.value.total.floor_price
          : undefined;
      return nfts.map((n) => openSeaNFTToUnified(n, floor));
    })
  );

  const allNfts: NFTData[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allNfts.push(...result.value);
    }
  }

  return allNfts.filter((n) => n.image);
}

export function fetchCollectionData(
  contract: string
): Promise<CollectionData | null> {
  if (USE_MOCK) {
    if (contract.toLowerCase() === MAYC_CONTRACT.toLowerCase()) {
      return Promise.resolve(maycCollection);
    }
    return Promise.resolve(maycCollection);
  }
  return Promise.resolve(null);
}

export function fetchCollectionPriceHistory(): PricePoint[] {
  if (USE_MOCK) {
    return generateCollectionPriceHistory();
  }
  return [];
}

// ---- Mock helper ----

function toUnifiedNFT(mock: MockNFT): NFTData {
  const floor = maycCollection.floorPrice;
  const totalSupply = maycCollection.totalSupply;
  return {
    tokenId: mock.tokenId,
    name: mock.name,
    contract: mock.contract,
    collection: mock.collection,
    image: mock.image,
    rank: mock.rank,
    traits: mock.traits.map((t) => ({
      traitType: t.traitType,
      value: t.value,
      rarity: t.rarity,
      count: Math.round(totalSupply * (t.rarity / 100)),
      ethValue: floor,
    })),
    lastSale: mock.lastSale,
    listPrice: mock.listPrice,
    owner: mock.owner,
    description: mock.description,
    floorPrice: floor,
  };
}
