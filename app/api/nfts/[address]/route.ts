import { fetchNFTsForAddress } from "@/lib/data-source";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  try {
    const data = await fetchNFTsForAddress(address);
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return Response.json({ error: "Failed to fetch NFTs" }, { status: 500 });
  }
}
