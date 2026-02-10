export interface SaleEvent {
  date: Date;
  price: number;
  marketplace: string;
  from: string;
  to: string;
}

export interface PricePoint {
  date: Date;
  price: number;
}

const MARKETPLACES = ["OpenSea", "Blur", "LooksRare", "X2Y2"];

// Seeded random for consistent data
let historySeed = 123;
function rand(): number {
  historySeed = (historySeed * 16_807) % 2_147_483_647;
  return (historySeed - 1) / 2_147_483_646;
}

function randomAddress(): string {
  const hex = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += hex[Math.floor(rand() * 16)];
  }
  return addr;
}

/**
 * Generate 90 days of floor price history for the collection.
 * Simulates realistic price movement around ~0.9 ETH.
 */
export function generateCollectionPriceHistory(): PricePoint[] {
  const now = new Date();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const history: PricePoint[] = [];

  let price = 0.85;

  for (let d = 89; d >= 0; d--) {
    const date = new Date(now.getTime() - d * DAY_MS);
    // Random walk with mean reversion toward 0.92
    const drift = (0.92 - price) * 0.05;
    const noise = (rand() - 0.5) * 0.04;
    price = Math.max(0.6, price + drift + noise);
    history.push({
      date,
      price: Number(price.toFixed(4)),
    });
  }

  return history;
}

/**
 * Generate sale events for a specific NFT over 90 days.
 * Returns 3-8 sales with realistic prices and marketplaces.
 */
export function generateNFTSaleHistory(tokenId: string): {
  history: PricePoint[];
  sales: SaleEvent[];
} {
  // Use tokenId to seed for consistency
  historySeed = Number.parseInt(tokenId, 10) || 42;

  const now = new Date();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const numSales = 3 + Math.floor(rand() * 6); // 3-8 sales

  // Generate sale dates spread across 90 days
  const saleDays: number[] = [];
  for (let i = 0; i < numSales; i++) {
    saleDays.push(Math.floor(rand() * 85) + 2); // days ago (2-87)
  }
  saleDays.sort((a, b) => b - a); // oldest first

  // Generate sales with price evolution
  let salePrice = 0.7 + rand() * 0.3; // starting price 0.7-1.0
  const sales: SaleEvent[] = saleDays.map((daysAgo) => {
    const date = new Date(now.getTime() - daysAgo * DAY_MS);
    // Price changes by -15% to +25% between sales
    salePrice *= 0.85 + rand() * 0.4;
    salePrice = Math.max(0.3, Math.min(3.0, salePrice));

    return {
      date,
      price: Number(salePrice.toFixed(4)),
      marketplace: MARKETPLACES[Math.floor(rand() * MARKETPLACES.length)],
      from: randomAddress(),
      to: randomAddress(),
    };
  });

  // Generate daily price history (carrying last sale price forward)
  const history: PricePoint[] = [];
  let currentPrice = sales.length > 0 ? sales[0].price : 0.9;

  // Build sale lookup
  const saleByDay = new Map<string, number>();
  for (const sale of sales) {
    const key = sale.date.toISOString().split("T")[0];
    saleByDay.set(key, sale.price);
  }

  for (let d = 89; d >= 0; d--) {
    const date = new Date(now.getTime() - d * DAY_MS);
    const key = date.toISOString().split("T")[0];
    const saleOnDay = saleByDay.get(key);

    if (saleOnDay !== undefined) {
      currentPrice = saleOnDay;
    }

    history.push({
      date,
      price: Number(currentPrice.toFixed(4)),
    });
  }

  return { history, sales };
}
