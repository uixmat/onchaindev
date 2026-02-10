import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ensName } = await request.json();

  if (!ensName || typeof ensName !== "string") {
    return Response.json({ error: "Invalid ENS name" }, { status: 400 });
  }

  await db.update(user).set({ ensName }).where(eq(user.id, session.user.id));

  return Response.json({ success: true, ensName });
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, session.user.id),
  });

  return Response.json({ ensName: result?.ensName || null });
}
