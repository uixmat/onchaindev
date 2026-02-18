export interface NFTCollection {
  contract: string;
  name: string;
  image: string;
  floorPrice: number;
  owned: number;
  totalValue: number;
  change24h: number;
}

export interface NFT {
  tokenId: string;
  contract: string;
  name: string;
  image: string;
  collection: string;
  traits: Array<{ trait: string; value: string; rarity: number }>;
  lastSale: number | null;
}

export interface PortfolioData {
  address: string;
  totalValue: number;
  totalNFTs: number;
  collections: NFTCollection[];
  valueHistory: Array<{ date: string; value: number }>;
  nfts: NFT[];
}

// Generate value history for last 30 days
function generateValueHistory(
  baseValue: number
): Array<{ date: string; value: number }> {
  const history: Array<{ date: string; value: number }> = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * 0.15; // +/- 15%
    const value = baseValue * (1 + variance);
    history.push({
      date: date.toISOString().split("T")[0],
      value: Number(value.toFixed(2)),
    });
  }

  return history;
}

// Mock portfolios
const MOCK_PORTFOLIOS: Record<string, PortfolioData> = {
  "dfinzer.eth": {
    address: "dfinzer.eth",
    totalValue: 892.5,
    totalNFTs: 47,
    valueHistory: generateValueHistory(892.5),
    collections: [
      {
        contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        name: "Bored Ape Yacht Club",
        image:
          "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=256",
        floorPrice: 28.5,
        owned: 3,
        totalValue: 85.5,
        change24h: 12.3,
      },
      {
        contract: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
        name: "Mutant Ape Yacht Club",
        image:
          "https://i.seadn.io/gae/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI?auto=format&dpr=1&w=256",
        floorPrice: 12.2,
        owned: 2,
        totalValue: 24.4,
        change24h: -5.2,
      },
      {
        contract: "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
        name: "CloneX",
        image:
          "https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&dpr=1&w=256",
        floorPrice: 5.8,
        owned: 4,
        totalValue: 23.2,
        change24h: 8.1,
      },
      {
        contract: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        name: "Doodles",
        image:
          "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=256",
        floorPrice: 2.9,
        owned: 5,
        totalValue: 14.5,
        change24h: 3.7,
      },
      {
        contract: "0xed5af388653567af2f388e6224dc7c4b3241c544",
        name: "Azuki",
        image:
          "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=256",
        floorPrice: 8.4,
        owned: 2,
        totalValue: 16.8,
        change24h: -2.1,
      },
    ],
    nfts: Array.from({ length: 47 }, (_, i) => ({
      tokenId: `${1000 + i}`,
      contract: [
        "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
        "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
        "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        "0xed5af388653567af2f388e6224dc7c4b3241c544",
      ][i % 5],
      name: `NFT #${1000 + i}`,
      image: `https://via.placeholder.com/400/${["FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8"][i % 5]}/FFFFFF?text=NFT+${1000 + i}`,
      collection: [
        "Bored Ape Yacht Club",
        "Mutant Ape Yacht Club",
        "CloneX",
        "Doodles",
        "Azuki",
      ][i % 5],
      traits: [
        {
          trait: "Background",
          value: ["Blue", "Orange", "Purple", "Green"][i % 4],
          rarity: Math.floor(Math.random() * 20) + 1,
        },
        {
          trait: "Eyes",
          value: ["Laser", "3D", "Coins", "Heart"][i % 4],
          rarity: Math.floor(Math.random() * 10) + 1,
        },
        {
          trait: "Mouth",
          value: ["Bored", "Grin", "Smile"][i % 3],
          rarity: Math.floor(Math.random() * 15) + 5,
        },
      ],
      lastSale:
        Math.random() > 0.5
          ? Number((Math.random() * 50 + 10).toFixed(2))
          : null,
    })),
  },
  whale: {
    address: "whale",
    totalValue: 1250.0,
    totalNFTs: 8,
    valueHistory: generateValueHistory(1250),
    collections: [
      {
        contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        name: "Bored Ape Yacht Club",
        image:
          "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=256",
        floorPrice: 28.5,
        owned: 5,
        totalValue: 142.5,
        change24h: 8.2,
      },
      {
        contract: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
        name: "CryptoPunks",
        image:
          "https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&dpr=1&w=256",
        floorPrice: 45.2,
        owned: 3,
        totalValue: 135.6,
        change24h: 15.7,
      },
    ],
    nfts: Array.from({ length: 8 }, (_, i) => ({
      tokenId: `${5000 + i}`,
      contract:
        i < 5
          ? "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
          : "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      name: `Blue Chip #${5000 + i}`,
      image: `https://via.placeholder.com/400/${i < 5 ? "8B5CF6" : "F59E0B"}/FFFFFF?text=${5000 + i}`,
      collection: i < 5 ? "Bored Ape Yacht Club" : "CryptoPunks",
      traits: [
        { trait: "Background", value: "Gold", rarity: 2 },
        { trait: "Rarity", value: "Legendary", rarity: 1 },
      ],
      lastSale: i < 5 ? 28.5 : 45.2,
    })),
  },
};

export function getMockPortfolio(address: string): PortfolioData | null {
  // Normalize address
  const normalized = address.toLowerCase();

  // Check for known addresses
  if (normalized === "dfinzer.eth" || normalized.includes("dfinzer")) {
    return MOCK_PORTFOLIOS["dfinzer.eth"];
  }

  if (normalized === "whale" || normalized.includes("whale")) {
    return MOCK_PORTFOLIOS.whale;
  }

  // Return empty portfolio for unknown addresses
  return {
    address,
    totalValue: 0,
    totalNFTs: 0,
    collections: [],
    valueHistory: [],
    nfts: [],
  };
}

export function getMockNFT(contract: string, tokenId: string): NFT | null {
  // Search through all portfolios
  for (const portfolio of Object.values(MOCK_PORTFOLIOS)) {
    const nft = portfolio.nfts.find(
      (n) => n.contract === contract && n.tokenId === tokenId
    );
    if (nft) {
      return nft;
    }
  }
  return null;
}
