"use client";

import {
  Area,
  AreaChart,
  ChartTooltip,
  Grid,
  XAxis,
} from "@/components/charts";

interface PortfolioValueChartProps {
  data: Array<{ date: string; value: number }>;
}

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  // Transform data for chart
  const chartData = data.map((d) => ({
    date: new Date(d.date),
    value: d.value,
  }));

  return (
    <AreaChart data={chartData} xDataKey="date">
      <Grid horizontal />
      <Area
        dataKey="value"
        fill="hsl(var(--chart-1))"
        fillOpacity={0.4}
        strokeWidth={2}
      />
      <XAxis />
      <ChartTooltip
        rows={(point) => [
          {
            color: "hsl(var(--chart-1))",
            label: "Portfolio Value",
            value: `${point.value?.toFixed(2)} ETH`,
          },
        ]}
      />
    </AreaChart>
  );
}
