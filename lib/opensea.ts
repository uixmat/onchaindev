const API_KEY = process.env.OPENSEA_API_KEY;
const BASE = "https://api.opensea.io";

function headers(): HeadersInit {
  return {
    accept: "application/json",
    "x-api-key": API_KEY ?? "",
  };
}

async function get<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(),
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`OpenSea API ${res.status}: ${path}`);
  }
  return res.json();
}

// ---- Response types ----

export interface OpenSeaNFT {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string | null;
  description: string | null;
  image_url: string | null;
  display_image_url: string | null;
  display_animation_url: string | null;
  metadata_url: string | null;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  traits?: OpenSeaTrait[];
  owners?: Array<{
    address: string;
    quantity: number;
  }>;
  rarity?: {
    strategy_id: string;
    strategy_version: string;
    rank: number;
    score: number;
    calculated_at: string;
    max_rank: number;
    total_supply: number;
    ranking_features: Record<string, unknown>;
  };
}

export interface OpenSeaTrait {
  trait_type: string;
  display_type: string | null;
  max_value: string | null;
  value: string;
}

export interface OpenSeaCollection {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: string;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  opensea_url: string;
  project_url: string;
  discord_url: string;
  twitter_username: string;
  contracts: Array<{ address: string; chain: string }>;
  total_supply: number;
  rarity?: {
    max_rank: number;
    total_supply: number;
  };
}

export interface CollectionStats {
  total: {
    volume: number;
    sales: number;
    num_owners: number;
    market_cap: number;
    floor_price: number;
    floor_price_symbol: string;
    average_price: number;
  };
  intervals: Array<{
    interval: string;
    volume: number;
    volume_diff: number;
    volume_change: number;
    sales: number;
    sales_diff: number;
    average_price: number;
  }>;
}

export interface AccountProfile {
  address: string;
  username: string | null;
  profile_image_url: string;
  banner_image_url: string;
  website: string;
  social_media_accounts: Array<{
    platform: string;
    username: string;
  }>;
  bio: string;
  joined_date: string;
}

export interface AccountNFTsResponse {
  nfts: OpenSeaNFT[];
  next: string | null;
}

export interface NFTDetailResponse {
  nft: OpenSeaNFT;
}

// ---- API functions ----

export type Chain =
  | "ethereum"
  | "matic"
  | "arbitrum"
  | "optimism"
  | "base"
  | "avalanche"
  | "klaytn"
  | "zora"
  | "blast"
  | "sepolia";

export function getNFTsByAccount(
  chain: Chain,
  address: string,
  limit = 50,
  next?: string
): Promise<AccountNFTsResponse> {
  const cursor = next ? `&next=${encodeURIComponent(next)}` : "";
  return get<AccountNFTsResponse>(
    `/api/v2/chain/${chain}/account/${address}/nfts?limit=${limit}${cursor}`
  );
}

export function getNFTDetail(
  chain: Chain,
  contract: string,
  tokenId: string
): Promise<NFTDetailResponse> {
  return get<NFTDetailResponse>(
    `/api/v2/chain/${chain}/contract/${contract}/nfts/${tokenId}`,
    0
  );
}

export function getCollection(slug: string): Promise<OpenSeaCollection> {
  return get<OpenSeaCollection>(`/api/v2/collections/${slug}`);
}

export function getCollectionStats(slug: string): Promise<CollectionStats> {
  return get<CollectionStats>(`/api/v2/collections/${slug}/stats`);
}

export function getAccountProfile(address: string): Promise<AccountProfile> {
  return get<AccountProfile>(`/api/v2/accounts/${address}`);
}

export function getCollectionNFTs(
  slug: string,
  limit = 50,
  next?: string
): Promise<AccountNFTsResponse> {
  const cursor = next ? `&next=${encodeURIComponent(next)}` : "";
  return get<AccountNFTsResponse>(
    `/api/v2/collection/${slug}/nfts?limit=${limit}${cursor}`
  );
}

export interface CollectionListItem {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: string;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  opensea_url: string;
  contracts: Array<{ address: string; chain: string }>;
}

export function listCollections(
  orderBy:
    | "seven_day_volume"
    | "one_day_volume"
    | "created_date" = "seven_day_volume",
  limit = 10
): Promise<{ collections: CollectionListItem[]; next: string | null }> {
  return get<{ collections: CollectionListItem[]; next: string | null }>(
    `/api/v2/collections?order_by=${orderBy}&limit=${limit}`
  );
}

export interface SaleEvent {
  event_type: string;
  event_timestamp: number;
  transaction: string;
  chain: string;
  payment: {
    quantity: string;
    token_address: string;
    decimals: number;
    symbol: string;
  };
  seller: string;
  buyer: string;
  quantity: number;
  nft: {
    identifier: string;
    collection: string;
    contract: string;
    name: string | null;
    image_url: string | null;
    display_image_url: string | null;
  };
}

export function getEventsByCollection(
  slug: string,
  eventType = "sale",
  limit = 50
): Promise<{ asset_events: SaleEvent[] }> {
  return get<{ asset_events: SaleEvent[] }>(
    `/api/v2/events/collection/${slug}?event_type=${eventType}&limit=${limit}`
  );
}

export function getEventsByNFT(
  chain: Chain,
  contract: string,
  tokenId: string,
  eventType = "sale",
  limit = 20
): Promise<{ asset_events: SaleEvent[] }> {
  return get<{ asset_events: SaleEvent[] }>(
    `/api/v2/events/chain/${chain}/contract/${contract}/nfts/${tokenId}?event_type=${eventType}&limit=${limit}`
  );
}

export function getEventsByAccount(
  chain: Chain,
  address: string,
  eventType?: string,
  limit = 20
): Promise<{ asset_events: SaleEvent[] }> {
  const typeFilter = eventType ? `&event_type=${eventType}` : "";
  return get<{ asset_events: SaleEvent[] }>(
    `/api/v2/events/chain/${chain}/account/${address}?limit=${limit}${typeFilter}`
  );
}
