import { createPublicClient, http, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { getAccountProfile } from "@/lib/opensea";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  let { address } = await params;

  try {
    if (!isAddress(address)) {
      const resolved = await client.getEnsAddress({
        name: normalize(address),
      });
      if (!resolved) {
        return Response.json(
          { error: "Could not resolve ENS name" },
          { status: 400 }
        );
      }
      address = resolved;
    }

    const profile = await getAccountProfile(address);
    return Response.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
