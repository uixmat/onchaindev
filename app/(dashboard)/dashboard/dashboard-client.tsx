"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Coins, LogOut, Network } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLinkWallet } from "@/hooks/use-link-wallet";
import { authClient } from "@/lib/auth-client";
import { anvil } from "@/lib/wagmi";

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null | undefined;
  };
}

export function DashboardClient({ session }: { session: Session }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  // Auto-link wallet when connected
  useLinkWallet();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const { user } = session;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  let chainName = `Chain ${chainId}`;
  if (chainId === anvil.id) {
    chainName = "Anvil Local";
  }
  if (chainId === 1) {
    chainName = "Ethereum";
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="font-semibold text-lg">onchain</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage alt={user.name} src={user.image ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.name}</span>
          </div>
          <ModeToggle />
          <Button onClick={handleSignOut} size="sm" variant="ghost">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarImage alt={user.name} src={user.image ?? undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
              <CardDescription>Connect your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectButton />
            </CardContent>
          </Card>

          {isConnected && address && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="size-5" />
                    Balance
                  </CardTitle>
                  <CardDescription>Current holdings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-bold font-mono text-3xl">
                      {balance
                        ? `${Number(balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${balance.symbol}`
                        : "Loading..."}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                    <Network className="size-4 text-muted-foreground" />
                    <span className="text-sm">{chainName}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>Recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    No transactions yet. Send ETH or interact with contracts to
                    see activity here.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
