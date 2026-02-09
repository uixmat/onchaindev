"use client";

import { Coins, Network } from "lucide-react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { EnsInput } from "@/components/ens-input";
import { PageTransition } from "@/components/page-transition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletConnect } from "@/components/wallet-connect";
import { WalletInput } from "@/components/wallet-input";
import { useLinkWallet } from "@/hooks/use-link-wallet";
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
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  // Auto-link wallet when connected
  useLinkWallet();

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
    <PageTransition>
      <div className="mx-auto grid max-w-4xl gap-6 p-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <EnsInput />
          </CardContent>
        </Card>

        {/* Wallet Card (merged with balance) */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>
              {isConnected ? "Connected" : "Connect your wallet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <WalletConnect />
            {isConnected && address && balance && (
              <div className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                      Balance
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="size-3 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">
                      {chainName}
                    </span>
                  </div>
                </div>
                <p className="font-bold font-mono text-2xl">
                  {Number(balance.formatted).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}{" "}
                  {balance.symbol}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Portfolio Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Explore Portfolio</CardTitle>
            <CardDescription>
              Enter any wallet address or ENS name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletInput />
            <p className="mt-2 text-muted-foreground text-xs">
              Try: vitalik.eth or any Ethereum address
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
