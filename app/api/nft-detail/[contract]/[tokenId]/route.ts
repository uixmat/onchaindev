import { fetchNFTDetail } from "@/lib/data-source";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contract: string; tokenId: string }> }
) {
  const { contract, tokenId } = await params;

  try {
    const data = await fetchNFTDetail(contract, tokenId);
    if (!data.nft) {
      return Response.json({ error: "NFT not found" }, { status: 404 });
    }
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching NFT detail:", error);
    return Response.json(
      { error: "Failed to fetch NFT details" },
      { status: 500 }
    );
  }
}
