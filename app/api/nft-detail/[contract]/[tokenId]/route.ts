import { getNFTMetadata } from "@/lib/alchemy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contract: string; tokenId: string }> }
) {
  const { contract, tokenId } = await params;

  try {
    const nft = await getNFTMetadata(contract, tokenId);
    return Response.json(nft);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    return Response.json(
      { error: "Failed to fetch NFT metadata" },
      { status: 500 }
    );
  }
}
