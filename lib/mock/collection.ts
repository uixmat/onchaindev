export interface CollectionData {
  contract: string;
  name: string;
  symbol: string;
  creator: string;
  description: string;
  mintedDate: string;
  totalSupply: number;
  floorPrice: number;
  totalVolume: number;
  owners: number;
  ownerPercentage: number;
  listedPercentage: number;
  imageUrl: string;
  bannerUrl: string;
  externalUrl: string;
  traitCategories: Array<{ name: string; count: number }>;
}

export const MAYC_CONTRACT = "0x60E4d786628Fea6478F785A6d7e704777c86a7c6";

export const maycCollection: CollectionData = {
  contract: MAYC_CONTRACT,
  name: "Mutant Ape Yacht Club",
  symbol: "MAYC",
  creator: "Yuga Labs",
  description:
    "The MUTANT APE YACHT CLUB is a collection of up to 20,000 Mutant Apes that can only be created by exposing an existing Bored Ape to a vial of MUTANT SERUM or by minting a Mutant Ape in the public sale.",
  mintedDate: "2021-08-28",
  totalSupply: 19_558,
  floorPrice: 0.9178,
  totalVolume: 1_100_000,
  owners: 12_049,
  ownerPercentage: 61.6,
  listedPercentage: 1.8,
  imageUrl:
    "https://i.seadn.io/gae/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI?auto=format&dpr=1&w=256",
  bannerUrl:
    "https://i.seadn.io/gcs/files/5091a32894454a10925e86e tried8d8faa90e.png?auto=format&dpr=1&w=1920",
  externalUrl: "https://boredapeyachtclub.com",
  traitCategories: [
    { name: "Background", count: 16 },
    { name: "Clothes", count: 86 },
    { name: "Earring", count: 12 },
    { name: "Eyes", count: 46 },
    { name: "Fur", count: 38 },
    { name: "Hat", count: 72 },
    { name: "Mouth", count: 66 },
  ],
};
