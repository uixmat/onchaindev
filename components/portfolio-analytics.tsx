"use client";

import { Award, Coins, Grid3X3, Layers } from "lucide-react";
import { RadarArea } from "@/components/charts/radar-area";
import { RadarAxis } from "@/components/charts/radar-axis";
import { RadarChart } from "@/components/charts/radar-chart";
import { RadarGrid } from "@/components/charts/radar-grid";
import { RadarLabels } from "@/components/charts/radar-labels";
import { EthIcon } from "@/components/icons/eth";
import { Card, CardContent } from "@/components/ui/card";

interface NFT {
  tokenId: string;
  name: string;
  rank?: number;
  traits: Array<{ traitType: string; value: string; rarity?: number }>;
  floorPrice?: number;
  lastSale?: number;
  collection: string;
}

interface PortfolioAnalyticsProps {
  nfts: NFT[];
}

export function PortfolioStats({ nfts }: PortfolioAnalyticsProps) {
  if (nfts.length === 0) {
    return null;
  }

  const totalNFTs = nfts.length;
  const estimatedValue = nfts.reduce(
    (sum, nft) => sum + (nft.floorPrice || nft.lastSale || 0),
    0
  );
  const collections = new Set(nfts.map((n) => n.collection)).size;
  const rankedNFTs = nfts.filter((n) => n.rank);
  const rarestNFT =
    rankedNFTs.length > 0
      ? rankedNFTs.reduce((best, nft) =>
          (nft.rank || 99_999) < (best.rank || 99_999) ? nft : best
        )
      : null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card className="py-4">
        <CardContent className="flex items-center gap-3 px-4 py-0">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Grid3X3 className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-2xl">{totalNFTs}</p>
            <p className="text-muted-foreground text-xs">NFTs Owned</p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="flex items-center gap-3 px-4 py-0">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Coins className="size-4 text-primary" />
          </div>
          <div>
            <p className="flex items-center gap-1 font-bold font-mono text-2xl">
              <EthIcon height="18px" />
              {estimatedValue.toFixed(2)}
            </p>
            <p className="text-muted-foreground text-xs">Est. Value</p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="flex items-center gap-3 px-4 py-0">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-2xl">{collections}</p>
            <p className="text-muted-foreground text-xs">Collections</p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardContent className="flex items-center gap-3 px-4 py-0">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Award className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-2xl">
              {rarestNFT ? `#${rarestNFT.rank}` : "—"}
            </p>
            <p className="text-muted-foreground text-xs">Rarest NFT</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TraitDistribution({ nfts }: PortfolioAnalyticsProps) {
  // Aggregate trait counts
  const traitCounts = new Map<string, number>();
  for (const nft of nfts) {
    for (const trait of nft.traits) {
      const current = traitCounts.get(trait.traitType) || 0;
      traitCounts.set(trait.traitType, current + 1);
    }
  }

  const traitEntries = Array.from(traitCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  if (traitEntries.length < 3) {
    return null;
  }

  // Normalize to 0-100 for radar
  const maxCount = Math.max(...traitEntries.map(([, c]) => c));

  const metrics = traitEntries.map(([name]) => ({
    key: name,
    label: name,
  }));

  const values: Record<string, number> = {};
  for (const [name, count] of traitEntries) {
    values[name] = Math.round((count / maxCount) * 100);
  }

  const radarData = [
    {
      label: "Traits",
      values,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="flex justify-center">
        <RadarChart data={radarData} levels={4} metrics={metrics} size={340}>
          <RadarGrid showLabels={false} />
          <RadarAxis />
          <RadarLabels fontSize={12} offset={24} />
          {radarData.map((item, index) => (
            <RadarArea index={index} key={item.label} showPoints />
          ))}
        </RadarChart>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <p className="text-muted-foreground text-sm">
          Trait counts across your portfolio
        </p>
        <ul className="space-y-1.5">
          {traitEntries.map(([name, count]) => (
            <li
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5"
              key={name}
            >
              <span className="text-sm">{name}</span>
              <span className="font-mono text-muted-foreground text-xs">
                {count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
