import { fetchTrendingNFTs } from "@/lib/data-source";

export async function GET() {
  try {
    const nfts = await fetchTrendingNFTs();
    return Response.json({
      nfts,
      totalCount: nfts.length,
    });
  } catch (error) {
    console.error("Error fetching trending:", error);
    return Response.json(
      { error: "Failed to fetch trending NFTs" },
      { status: 500 }
    );
  }
}
