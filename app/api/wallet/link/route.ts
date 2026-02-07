import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wallet } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { address } = await request.json();

  if (!address || typeof address !== "string") {
    return Response.json({ error: "Invalid address" }, { status: 400 });
  }

  // Check if wallet already linked to this user
  const existing = await db.query.wallet.findFirst({
    where: (wallet, { and, eq }) =>
      and(eq(wallet.userId, session.user.id), eq(wallet.address, address)),
  });

  if (existing) {
    return Response.json({ wallet: existing });
  }

  // Check if this is the user's first wallet (set as primary)
  const userWallets = await db.query.wallet.findMany({
    where: (wallet, { eq }) => eq(wallet.userId, session.user.id),
  });

  const isPrimary = userWallets.length === 0;

  // Insert new wallet
  const [newWallet] = await db
    .insert(wallet)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      address: address.toLowerCase(),
      isPrimary,
    })
    .returning();

  return Response.json({ wallet: newWallet });
}
