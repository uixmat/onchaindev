"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { NFT } from "@/lib/mock-data";

interface NFTCardProps {
  nft: NFT;
  index: number;
}

export function NFTCard({ nft, index }: NFTCardProps) {
  return (
    <Link href={`/token/${nft.contract}/${nft.tokenId}`}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="group relative cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        transition={{
          delay: index * 0.05,
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="aspect-square overflow-hidden bg-muted">
          {/* biome-ignore lint/performance/noImgElement: external NFT images */}
          {/* biome-ignore lint/correctness/useImageSize: sized by parent container */}
          <motion.img
            alt={nft.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            src={nft.image}
          />
        </div>
        <div className="space-y-1 p-4">
          <p className="font-medium text-sm">{nft.name}</p>
          <p className="text-muted-foreground text-xs">{nft.collection}</p>
          {nft.lastSale && (
            <p className="font-mono text-xs">{nft.lastSale} ETH</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

// Skeleton loader for NFT card
export function NFTCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border bg-card"
      initial={{ opacity: 0, y: 20 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </motion.div>
  );
}
