"use client";

import {
  Bar,
  BarChart,
  BarYAxis,
  ChartTooltip,
  Grid,
} from "@/components/charts";
import type { NFTCollection } from "@/lib/mock-data";

interface TopCollectionsChartProps {
  collections: NFTCollection[];
}

export function TopCollectionsChart({ collections }: TopCollectionsChartProps) {
  // Take top 5 by value and prepare for horizontal bar chart
  const chartData = collections
    .slice(0, 5)
    .sort((a, b) => b.totalValue - a.totalValue)
    .map((col) => ({
      name: col.name.length > 20 ? `${col.name.slice(0, 20)}...` : col.name,
      value: col.totalValue,
    }));

  return (
    <BarChart
      data={chartData}
      margin={{ left: 120, right: 40, top: 20, bottom: 20 }}
      orientation="horizontal"
      xDataKey="name"
    >
      <Grid fadeVertical horizontal={false} vertical />
      <Bar dataKey="value" fill="hsl(var(--chart-1))" lineCap={4} />
      <BarYAxis />
      <ChartTooltip
        rows={(point) => [
          {
            color: "hsl(var(--chart-1))",
            label: point.name as string,
            value: `${point.value} ETH`,
          },
        ]}
        showCrosshair={false}
      />
    </BarChart>
  );
}
