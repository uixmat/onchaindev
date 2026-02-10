import { MAYC_CONTRACT } from "./collection";

export interface NFTTrait {
  traitType: string;
  value: string;
  rarity: number; // percentage
}

export interface MockNFT {
  tokenId: string;
  name: string;
  contract: string;
  collection: string;
  image: string;
  rank: number;
  traits: NFTTrait[];
  lastSale: number;
  listPrice: number | null;
  owner: string;
  description: string;
}

// Trait value pools with rarity percentages
const BACKGROUNDS = [
  { value: "M1 Army Green", rarity: 8.2 },
  { value: "M1 Aquamarine", rarity: 6.1 },
  { value: "M1 Blue", rarity: 7.8 },
  { value: "M1 Gray", rarity: 5.9 },
  { value: "M1 Orange", rarity: 6.4 },
  { value: "M1 Purple", rarity: 5.2 },
  { value: "M1 Yellow", rarity: 7.1 },
  { value: "M2 Blue", rarity: 4.8 },
  { value: "M2 Teal", rarity: 3.9 },
];

const CLOTHES = [
  { value: "Black T", rarity: 5.1 },
  { value: "Bone Tee", rarity: 3.2 },
  { value: "Hawaiian", rarity: 4.7 },
  { value: "Leather Jacket", rarity: 2.8 },
  { value: "Navy Striped Tee", rarity: 4.3 },
  { value: "Smoking Jacket", rarity: 1.9 },
  { value: "Striped Tee", rarity: 5.6 },
  { value: "Toga", rarity: 2.1 },
  { value: "Tuxedo Tee", rarity: 3.4 },
  { value: "Vietnam Jacket", rarity: 1.5 },
];

const EYES = [
  { value: "Bored", rarity: 12.4 },
  { value: "Bloodshot", rarity: 8.7 },
  { value: "Closed", rarity: 5.2 },
  { value: "Crazy", rarity: 3.8 },
  { value: "Heart", rarity: 1.2 },
  { value: "Hypnotized", rarity: 2.1 },
  { value: "Laser Eyes", rarity: 0.7 },
  { value: "Sleepy", rarity: 6.3 },
  { value: "X Eyes", rarity: 1.8 },
  { value: "Zombie", rarity: 4.1 },
];

const FUR = [
  { value: "Black", rarity: 7.2 },
  { value: "Blue", rarity: 3.1 },
  { value: "Brown", rarity: 9.8 },
  { value: "Cheetah", rarity: 2.4 },
  { value: "Dark Brown", rarity: 8.1 },
  { value: "DMT", rarity: 1.3 },
  { value: "Golden Brown", rarity: 5.6 },
  { value: "Gray", rarity: 4.7 },
  { value: "Noise", rarity: 1.8 },
  { value: "Pink", rarity: 2.9 },
  { value: "Red", rarity: 3.5 },
  { value: "Tan", rarity: 6.2 },
  { value: "Trippy", rarity: 0.9 },
  { value: "White", rarity: 4.1 },
  { value: "Zombie", rarity: 3.3 },
];

const HATS = [
  { value: "Army Hat", rarity: 4.2 },
  { value: "Bandana Blue", rarity: 3.1 },
  { value: "Beanie", rarity: 5.8 },
  { value: "Bowler", rarity: 2.7 },
  { value: "Commie Hat", rarity: 1.9 },
  { value: "Cowboy Hat", rarity: 3.4 },
  { value: "Fez", rarity: 2.1 },
  { value: "Fisherman's Hat", rarity: 4.6 },
  { value: "Halo", rarity: 0.8 },
  { value: "Horns", rarity: 1.2 },
  { value: "King's Crown", rarity: 0.5 },
  { value: "Laurel Wreath", rarity: 1.7 },
  { value: "Party Hat", rarity: 2.3 },
  { value: "Safari", rarity: 3.9 },
  { value: "Sea Captain's Hat", rarity: 1.4 },
  { value: "Short Mohawk", rarity: 3.2 },
  { value: "Spinner Hat", rarity: 2.6 },
  { value: "Stuntman Helmet", rarity: 1.1 },
  { value: "Sushi Chef Headband", rarity: 1.8 },
  { value: "Trippy Captain's Hat", rarity: 0.6 },
];

const MOUTHS = [
  { value: "Bored", rarity: 11.2 },
  { value: "Bored Bubblegum", rarity: 3.4 },
  { value: "Bored Cigarette", rarity: 5.1 },
  { value: "Bored Dagger", rarity: 1.2 },
  { value: "Bored Kazoo", rarity: 2.8 },
  { value: "Bored Pizza", rarity: 1.7 },
  { value: "Bored Pipe", rarity: 2.3 },
  { value: "Bored Unshaven", rarity: 8.6 },
  { value: "Grin", rarity: 4.9 },
  { value: "Phoneme Vuh", rarity: 3.1 },
  { value: "Rage", rarity: 2.4 },
  { value: "Tongue Out", rarity: 1.5 },
];

const EARRINGS = [
  { value: "Cross", rarity: 3.2 },
  { value: "Diamond Stud", rarity: 1.8 },
  { value: "Gold Hoop", rarity: 4.1 },
  { value: "Gold Stud", rarity: 5.3 },
  { value: "Silver Hoop", rarity: 4.7 },
  { value: "Silver Stud", rarity: 6.1 },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTraits(): NFTTrait[] {
  const traits: NFTTrait[] = [
    { traitType: "Background", ...pick(BACKGROUNDS) },
    { traitType: "Fur", ...pick(FUR) },
    { traitType: "Eyes", ...pick(EYES) },
    { traitType: "Mouth", ...pick(MOUTHS) },
    { traitType: "Clothes", ...pick(CLOTHES) },
  ];

  // 70% chance of hat
  if (Math.random() < 0.7) {
    traits.push({ traitType: "Hat", ...pick(HATS) });
  }

  // 40% chance of earring
  if (Math.random() < 0.4) {
    traits.push({ traitType: "Earring", ...pick(EARRINGS) });
  }

  return traits;
}

// Real MAYC token IDs mapped to local images
const NFTS_WITH_IMAGES: Array<{ id: string; image: string }> = [
  {
    id: "9820",
    image: "/collection/mutant-apes/0adcc40552bc2733a0715998daea2b75.avif",
  },
  {
    id: "10054",
    image: "/collection/mutant-apes/149f7d470e745cdb1c9162454d21844b.avif",
  },
  {
    id: "6610",
    image: "/collection/mutant-apes/162a0517322ac426d35af721f8fcb7a5.avif",
  },
  {
    id: "2457",
    image: "/collection/mutant-apes/2451b6ac444fd1d8ec172e9b698665ec.avif",
  },
  {
    id: "8738",
    image: "/collection/mutant-apes/2a99e2bed144cdfbae862e8309aa50ad.avif",
  },
  {
    id: "2643",
    image: "/collection/mutant-apes/34b627b24e6a68d10e6ddce9aa0d5bdc.avif",
  },
  {
    id: "9364",
    image: "/collection/mutant-apes/44158a00b5ce77080abc5f0634b8ea80.avif",
  },
  {
    id: "23198",
    image: "/collection/mutant-apes/44c42c1725f27e8c220862831fa46936.avif",
  },
  {
    id: "11618",
    image: "/collection/mutant-apes/66ea5c6d7010ddea92fe5048909492d8.avif",
  },
  {
    id: "29314",
    image: "/collection/mutant-apes/78d5006cba7c09d4066ef3873af40bf5.avif",
  },
  {
    id: "28850",
    image: "/collection/mutant-apes/7c8fc0f42d63c6f7308da2a953178bef.avif",
  },
  {
    id: "7864",
    image: "/collection/mutant-apes/8bc3e6353e2383253e51f7f0d7ce8dc1.avif",
  },
  {
    id: "26762",
    image: "/collection/mutant-apes/8ec9b9b77a5b44ae8543ab09686c0734.avif",
  },
  {
    id: "16068",
    image: "/collection/mutant-apes/9e26bb513d3f0ac0a000fb38f1827311.avif",
  },
  {
    id: "3945",
    image: "/collection/mutant-apes/b6c7c7f788d174fd714ec0fcf7af56c3.avif",
  },
  {
    id: "2291",
    image: "/collection/mutant-apes/c96a4e99fb141f678679052b94d0b72c.avif",
  },
  {
    id: "9040",
    image: "/collection/mutant-apes/ed3509ff5da0adc9b8611540a73d7b98.avif",
  },
  {
    id: "3772",
    image: "/collection/mutant-apes/ede03adf6a0db1fd6688d0438f95d84a.avif",
  },
  {
    id: "8349",
    image: "/collection/mutant-apes/efb0918a6f94df528989df9a0fa83426.avif",
  },
  {
    id: "27498",
    image: "/collection/mutant-apes/f93046a630d04def0bb2251aca40441c.avif",
  },
];

// Seed the random for consistent results
let seed = 42;
function seededRandom(): number {
  seed = (seed * 16_807) % 2_147_483_647;
  return (seed - 1) / 2_147_483_646;
}

const OWNERS = [
  "0x1A92f7381B9F03921564a437210bB9396471050C",
  "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
  "0xC5F59709974262c4AFacc5386287820bDBC7eB3A",
  "0x54BE3a794282C030b15E43416f0516611a6D067b",
  "0xce90a7949bb78892f159f428d0dc23a8e3b2e02b",
  "0x84af839E3b2a2BA48B99Da7ad663B0e519561332",
  "0xE72EB31b59F85b19499A0F3b3260011894FA0d65",
];

export const mockNFTs: MockNFT[] = NFTS_WITH_IMAGES.map(({ id, image }, i) => {
  const traits = generateTraits();
  const avgRarity =
    traits.reduce((sum, t) => sum + t.rarity, 0) / traits.length;
  const rank = Math.floor(1000 + avgRarity * 200 + seededRandom() * 5000);

  const basePrice = 0.8 + seededRandom() * 0.4;
  const lastSale = Number(basePrice.toFixed(4));
  const hasListing = seededRandom() > 0.5;
  const listPrice = hasListing
    ? Number((basePrice + seededRandom() * 0.2).toFixed(4))
    : null;

  return {
    tokenId: id,
    name: `Mutant Ape Yacht Club #${id}`,
    contract: MAYC_CONTRACT,
    collection: "Mutant Ape Yacht Club",
    image,
    rank,
    traits,
    lastSale,
    listPrice,
    owner: OWNERS[i % OWNERS.length],
    description:
      "The MUTANT APE YACHT CLUB is a collection of up to 20,000 Mutant Apes that can only be created by exposing an existing Bored Ape to a vial of MUTANT SERUM or by minting a Mutant Ape in the public sale.",
  };
});

export function getMockNFT(contract: string, tokenId: string): MockNFT | null {
  if (contract.toLowerCase() !== MAYC_CONTRACT.toLowerCase()) {
    return null;
  }
  return mockNFTs.find((nft) => nft.tokenId === tokenId) || null;
}
