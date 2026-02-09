import { getContractsForOwner, getNFTsForOwner } from "@/lib/alchemy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  try {
    const [nftsData, collectionsData] = await Promise.all([
      getNFTsForOwner(address),
      getContractsForOwner(address),
    ]);

    return Response.json({
      nfts: nftsData.ownedNfts,
      totalCount: nftsData.totalCount,
      collections: collectionsData.contracts.filter((c) => !c.isSpam),
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return Response.json({ error: "Failed to fetch NFTs" }, { status: 500 });
  }
}
