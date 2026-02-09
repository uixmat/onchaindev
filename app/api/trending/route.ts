import { getTopCollections } from "@/lib/alchemy";

export async function GET() {
  try {
    const data = await getTopCollections();
    return Response.json({
      nfts: data.ownedNfts,
      totalCount: data.totalCount,
    });
  } catch (error) {
    console.error("Error fetching trending:", error);
    return Response.json(
      { error: "Failed to fetch trending NFTs" },
      { status: 500 }
    );
  }
}
