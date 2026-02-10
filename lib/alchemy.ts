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

export interface NFTSale {
  sellerAddress: string;
  buyerAddress: string;
  taker: string;
  sellerFee: { amount: string; decimals: number };
  protocolFee: { amount: string; decimals: number };
  royaltyFee: { amount: string; decimals: number };
  marketplace: string;
  blockNumber: number;
  logIndex: number;
  bundleIndex: number;
  transactionHash: string;
  blockTimestamp: string;
}

export async function getNFTSales(
  contract: string,
  tokenId: string
): Promise<{ nftSales: NFTSale[] }> {
  const res = await fetch(
    `${BASE_URL}/getNFTSales?contractAddress=${contract}&tokenId=${tokenId}&limit=20`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  return res.json();
}

export async function getFloorPrice(contract: string): Promise<{
  openSea?: { floorPrice: number; priceCurrency: string };
  looksRare?: { floorPrice: number; priceCurrency: string };
}> {
  const res = await fetch(
    `${BASE_URL}/getFloorPrice?contractAddress=${contract}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  return res.json();
}

// Well-known collectors with diverse NFT holdings
const FEATURED_WALLETS = [
  "vitalik.eth", // Vitalik Buterin
  "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459", // Pranksy
  "0xC5F59709974262c4AFacc5386287820bDBC7eB3A", // Dingaling
  "0x54BE3a794282C030b15E43416f0516611a6D067b", // Seedphrase
  "0xce90a7949bb78892f159f428d0dc23a8e3b2e02b", // Punk6529
];

export async function getTopCollections(): Promise<{
  ownedNfts: AlchemyNFT[];
  totalCount: number;
}> {
  // Pick 3 random wallets to fetch from
  const shuffled = [...FEATURED_WALLETS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  // Fetch 16 NFTs from each selected wallet in parallel
  const results = await Promise.allSettled(
    selected.map(async (wallet) => {
      const res = await fetch(
        `${BASE_URL}/getNFTsForOwner?owner=${wallet}&withMetadata=true&pageSize=16`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) {
        return { ownedNfts: [] };
      }
      return res.json();
    })
  );

  // Combine and shuffle all NFTs
  const allNfts: AlchemyNFT[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.ownedNfts) {
      allNfts.push(...result.value.ownedNfts);
    }
  }

  // Shuffle combined results
  const shuffledNfts = allNfts.sort(() => Math.random() - 0.5);

  return {
    ownedNfts: shuffledNfts.slice(0, 48),
    totalCount: shuffledNfts.length,
  };
}
