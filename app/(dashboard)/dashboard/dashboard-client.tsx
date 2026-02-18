"use client";

import { Coins, ExternalLink, Network } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { EnsInput } from "@/components/ens-input";
import { EthIcon } from "@/components/icons/eth";
import { NftMedia } from "@/components/nft-media";
import { PageTransition } from "@/components/page-transition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

interface NFTData {
  tokenId: string;
  name: string;
  contract: string;
  collection: string;
  image: string;
  floorPrice?: number;
}

const PREVIEW_COUNT = 8;

function NFTCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-square" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function DashboardClient({ session }: { session: Session }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nftsLoading, setNftsLoading] = useState(false);

  useLinkWallet();

  useEffect(() => {
    if (!(isConnected && address)) {
      setNfts([]);
      setTotalCount(0);
      return;
    }
    setNftsLoading(true);
    fetch(`/api/nfts/${address}`)
      .then((res) => res.json())
      .then((data) => {
        setNfts(data.nfts || []);
        setTotalCount(data.totalCount || 0);
      })
      .catch(() => undefined)
      .finally(() => setNftsLoading(false));
  }, [isConnected, address]);

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

  const estimatedValue = nfts.reduce((sum, n) => sum + (n.floorPrice ?? 0), 0);
  const collections = new Set(nfts.map((n) => n.collection));

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
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

          {/* Wallet Card */}
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

          {/* Explore Portfolio Card */}
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
                Try: dfinzer.eth or any Ethereum address
              </p>
            </CardContent>
          </Card>
        </div>

        {/* NFT Portfolio Section */}
        {isConnected && address && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-xl">Your NFTs</h2>
                {!nftsLoading && nfts.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    {totalCount} NFTs across {collections.size} collection
                    {collections.size !== 1 ? "s" : ""}
                    {estimatedValue > 0 && (
                      <span className="ml-2 inline-flex items-center gap-0.5">
                        <EthIcon height="11px" />
                        {estimatedValue.toFixed(2)} est. value
                      </span>
                    )}
                  </p>
                )}
              </div>
              {!nftsLoading && nfts.length > 0 && (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/portfolio/${address}`}>
                    View Full Portfolio
                    <ExternalLink className="ml-1 size-3" />
                  </Link>
                </Button>
              )}
            </div>

            {nftsLoading && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <NFTCardSkeleton key={`skel-${i}`} />
                ))}
              </div>
            )}

            {!nftsLoading && nfts.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No NFTs found for this wallet on Ethereum.
                  </p>
                </CardContent>
              </Card>
            )}

            {!nftsLoading && nfts.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {nfts.slice(0, PREVIEW_COUNT).map((nft, index) => (
                  <Link
                    href={`/token/${nft.contract}/${nft.tokenId}`}
                    key={`${nft.contract}-${nft.tokenId}`}
                  >
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      whileHover={{
                        scale: 1.03,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        },
                      }}
                    >
                      <div className="aspect-square overflow-hidden bg-muted">
                        {nft.image ? (
                          <NftMedia
                            alt={nft.name}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                            height={400}
                            src={nft.image}
                            width={400}
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="truncate font-medium text-sm">
                          {nft.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="truncate text-muted-foreground text-xs">
                            {nft.collection}
                          </p>
                          {nft.floorPrice != null && nft.floorPrice > 0 && (
                            <p className="flex items-center gap-0.5 font-mono text-xs">
                              <EthIcon height="10px" />
                              {nft.floorPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {!nftsLoading && nfts.length > PREVIEW_COUNT && (
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href={`/portfolio/${address}`}>
                    View all {totalCount} NFTs
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
