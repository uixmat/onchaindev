import {
  getContractsForOwner,
  getFloorPrice,
  getNFTMetadata,
  getNFTSales,
  getNFTsForOwner,
  getTopCollections,
} from "./alchemy";
import { MAYC_CONTRACT, maycCollection } from "./mock/collection";
import { getMockNFT, mockNFTs } from "./mock/nfts";
import type { PricePoint, SaleEvent } from "./mock/price-history";
import {
  generateCollectionPriceHistory,
  generateNFTSaleHistory,
} from "./mock/price-history";

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

  const [nftsData] = await Promise.all([
    getNFTsForOwner(address),
    getContractsForOwner(address),
  ]);

  const nfts: NFTData[] = nftsData.ownedNfts.map((nft) => ({
    tokenId: nft.tokenId,
    name: nft.name || `#${nft.tokenId}`,
    contract: nft.contract.address,
    collection:
      nft.contract.openSeaMetadata?.collectionName ||
      nft.contract.name ||
      "Unknown",
    image: nft.image?.cachedUrl || nft.image?.thumbnailUrl || "",
    traits: (nft.raw?.metadata?.attributes || []).map((a) => ({
      traitType: a.trait_type,
      value: a.value,
    })),
    floorPrice: nft.contract.openSeaMetadata?.floorPrice,
    description: nft.description,
  }));

  return {
    nfts: nfts.filter((n) => n.image),
    totalCount: nftsData.totalCount,
  };
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
}> {
  if (USE_MOCK) {
    const mock = getMockNFT(contract, tokenId);
    if (!mock) {
      return { nft: null, collection: null, priceHistory: [], sales: [] };
    }
    const { history, sales } = generateNFTSaleHistory(tokenId);
    return {
      nft: toUnifiedNFT(mock),
      collection: maycCollection,
      priceHistory: history,
      sales,
    };
  }

  // API mode
  try {
    const [nftRes, salesRes, floorRes] = await Promise.allSettled([
      getNFTMetadata(contract, tokenId),
      getNFTSales(contract, tokenId),
      getFloorPrice(contract),
    ]);

    const alchemyNft = nftRes.status === "fulfilled" ? nftRes.value : null;
    if (!alchemyNft) {
      return { nft: null, collection: null, priceHistory: [], sales: [] };
    }

    const nft: NFTData = {
      tokenId: alchemyNft.tokenId,
      name: alchemyNft.name || `Token #${alchemyNft.tokenId}`,
      contract: alchemyNft.contract.address,
      collection:
        alchemyNft.contract.openSeaMetadata?.collectionName ||
        alchemyNft.contract.name ||
        "Unknown",
      image:
        alchemyNft.image?.cachedUrl ||
        alchemyNft.image?.originalUrl ||
        alchemyNft.image?.thumbnailUrl ||
        "",
      traits: (alchemyNft.raw?.metadata?.attributes || []).map((a) => {
        const floor =
          (floorRes.status === "fulfilled"
            ? floorRes.value.openSea?.floorPrice
            : null) ?? alchemyNft.contract.openSeaMetadata?.floorPrice;
        return {
          traitType: a.trait_type,
          value: a.value,
          ethValue: typeof floor === "number" ? floor : undefined,
        };
      }),
      floorPrice:
        (floorRes.status === "fulfilled"
          ? floorRes.value.openSea?.floorPrice
          : null) ?? alchemyNft.contract.openSeaMetadata?.floorPrice,
      description:
        alchemyNft.description ||
        alchemyNft.contract.openSeaMetadata?.description,
    };

    const rawSales =
      salesRes.status === "fulfilled" ? salesRes.value.nftSales : [];

    // Convert Alchemy sales to our format
    const DAY_MS = 24 * 60 * 60 * 1000;
    const genesisTs = 1_438_269_973;
    const sales: SaleEvent[] = rawSales.map((s) => {
      const ts = genesisTs + s.blockNumber * 12;
      const price =
        Number.parseInt(s.sellerFee.amount, 10) /
        10 ** (s.sellerFee.decimals || 18);
      return {
        date: new Date(ts * 1000),
        price: Number(price.toFixed(4)),
        marketplace: s.marketplace || "Unknown",
        from: s.sellerAddress,
        to: s.buyerAddress,
      };
    });

    // Build daily history from sales
    const sortedSales = [...sales]
      .filter((s) => s.price > 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const priceHistory: PricePoint[] = [];
    if (sortedSales.length > 0) {
      const first = sortedSales[0].date;
      const last = sortedSales.at(-1)?.date ?? first;
      const totalDays = Math.ceil((last.getTime() - first.getTime()) / DAY_MS);

      const saleMap = new Map<string, number>();
      for (const s of sortedSales) {
        saleMap.set(s.date.toISOString().split("T")[0], s.price);
      }

      let lastPrice = sortedSales[0].price;
      for (let d = 0; d <= totalDays; d++) {
        const date = new Date(first.getTime() + d * DAY_MS);
        const key = date.toISOString().split("T")[0];
        const salePrice = saleMap.get(key);
        if (salePrice !== undefined) {
          lastPrice = salePrice;
        }
        priceHistory.push({ date, price: lastPrice });
      }
    }

    return { nft, collection: null, priceHistory, sales: sortedSales };
  } catch {
    return { nft: null, collection: null, priceHistory: [], sales: [] };
  }
}

export async function fetchTrendingNFTs(): Promise<NFTData[]> {
  if (USE_MOCK) {
    // Shuffle mock NFTs
    return [...mockNFTs].sort(() => Math.random() - 0.5).map(toUnifiedNFT);
  }

  const data = await getTopCollections();
  return data.ownedNfts
    .filter((nft) => nft.image?.cachedUrl || nft.image?.thumbnailUrl)
    .map((nft) => ({
      tokenId: nft.tokenId,
      name: nft.name || `#${nft.tokenId}`,
      contract: nft.contract.address,
      collection:
        nft.contract.openSeaMetadata?.collectionName ||
        nft.contract.name ||
        "Unknown",
      image: nft.image?.cachedUrl || nft.image?.thumbnailUrl || "",
      traits: (nft.raw?.metadata?.attributes || []).map((a) => ({
        traitType: a.trait_type,
        value: a.value,
      })),
      floorPrice: nft.contract.openSeaMetadata?.floorPrice,
    }));
}

export function fetchCollectionData(
  contract: string
): Promise<CollectionData | null> {
  if (USE_MOCK) {
    if (contract.toLowerCase() === MAYC_CONTRACT.toLowerCase()) {
      return Promise.resolve(maycCollection);
    }
    return Promise.resolve(maycCollection); // fallback to MAYC for any contract in mock mode
  }
  return Promise.resolve(null);
}

export function fetchCollectionPriceHistory(): PricePoint[] {
  if (USE_MOCK) {
    return generateCollectionPriceHistory();
  }
  return [];
}

// ---- Helper ----

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
