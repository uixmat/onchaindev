const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const BASE_URL = `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`;

export interface AlchemyNFT {
  contract: {
    address: string;
    name?: string;
    symbol?: string;
    totalSupply?: string;
    openSeaMetadata?: {
      floorPrice?: number;
      collectionName?: string;
      collectionSlug?: string;
      imageUrl?: string;
      description?: string;
    };
  };
  tokenId: string;
  tokenType: string;
  name?: string;
  description?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    pngUrl?: string;
    originalUrl?: string;
  };
  raw?: {
    metadata?: { attributes?: Array<{ trait_type: string; value: string }> };
  };
}

export interface AlchemyCollection {
  address: string;
  name?: string;
  symbol?: string;
  totalBalance: number;
  numDistinctTokensOwned: number;
  isSpam: boolean;
  tokenId: string;
  media?: { cachedUrl?: string; thumbnailUrl?: string };
  openSeaMetadata?: {
    floorPrice?: number;
    collectionName?: string;
    imageUrl?: string;
    description?: string;
  };
}

export async function getNFTsForOwner(
  address: string,
  pageSize = 50
): Promise<{ ownedNfts: AlchemyNFT[]; totalCount: number }> {
  const res = await fetch(
    `${BASE_URL}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=${pageSize}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  return res.json();
}

export async function getNFTMetadata(
  contract: string,
  tokenId: string
): Promise<AlchemyNFT> {
  const res = await fetch(
    `${BASE_URL}/getNFTMetadata?contractAddress=${contract}&tokenId=${tokenId}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  return res.json();
}

export async function getContractsForOwner(
  address: string
): Promise<{ contracts: AlchemyCollection[]; totalCount: number }> {
  const res = await fetch(`${BASE_URL}/getContractsForOwner?owner=${address}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  return res.json();
}

export async function getTopCollections(): Promise<{
  ownedNfts: AlchemyNFT[];
  totalCount: number;
}> {
  // Fetch NFTs from a well-known collector to show "trending" data
  // Using a known whale address for variety
  const res = await fetch(
    `${BASE_URL}/getNFTsForOwner?owner=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&withMetadata=true&pageSize=50`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  return res.json();
}
