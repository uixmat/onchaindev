"use client";

import { curveBasis } from "@visx/curve";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { LineChart } from "@/components/charts/line-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";
import { EthIcon } from "@/components/icons/eth";

interface PricePoint {
  date: string;
  price: number;
}

interface Sale {
  date: string;
  price: number;
  marketplace: string;
}

interface PriceHistoryChartProps {
  history: PricePoint[];
  sales: Sale[];
}

export function PriceHistoryChart({ history }: PriceHistoryChartProps) {
  if (history.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No sales data available for this collection.
      </p>
    );
  }

  const chartData = history.map((p) => ({
    date: new Date(p.date),
    price: p.price,
  }));

  const lastPrice = chartData.at(-1)?.price ?? 0;
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <div className="flex items-center gap-2">
          <EthIcon className="text-foreground" height="20px" />
          <span className="font-mono font-semibold text-xl">
            {lastPrice.toFixed(2)}
          </span>
          <span className="text-muted-foreground text-xs">latest sale</span>
        </div>
        <div className="flex gap-4 text-muted-foreground text-xs">
          <span>
            Avg: <span className="font-mono">{avgPrice.toFixed(2)}</span>
          </span>
          <span>
            Low: <span className="font-mono">{minPrice.toFixed(2)}</span>
          </span>
          <span>
            High: <span className="font-mono">{maxPrice.toFixed(2)}</span>
          </span>
        </div>
      </div>

      <LineChart
        aspectRatio="3 / 1"
        data={chartData}
        margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
        xDataKey="date"
      >
        <Grid horizontal />
        <Line curve={curveBasis} dataKey="price" strokeWidth={2} />
        <XAxis />
        <ChartTooltip
          rows={(point) => {
            const p = point as Record<string, unknown>;
            return [
              {
                color: "var(--chart-line-primary)",
                label: "Sale Price",
                value: `Ξ ${Number(p.price).toFixed(2)}`,
              },
            ];
          }}
        />
      </LineChart>
    </div>
  );
}
