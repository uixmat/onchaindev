"use client";

import { PieCenter, PieChart, PieSlice } from "@/components/charts";
import type { NFTCollection } from "@/lib/mock-data";

interface CollectionDistributionChartProps {
  collections: NFTCollection[];
}

export function CollectionDistributionChart({
  collections,
}: CollectionDistributionChartProps) {
  const chartData = collections.slice(0, 5).map((col, i) => ({
    label: col.name,
    value: col.totalValue,
    color: `hsl(var(--chart-${(i % 5) + 1}))`,
  }));

  return (
    <div className="flex items-center justify-center">
      <PieChart data={chartData} innerRadius={70} size={240}>
        {chartData.map((_, index) => (
          <PieSlice hoverEffect="translate" index={index} key={index} />
        ))}
        <PieCenter defaultLabel="Total Value" prefix="" suffix=" ETH" />
      </PieChart>
    </div>
  );
}
