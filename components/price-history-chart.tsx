"use client";

import {
  type ChartMarker,
  ChartMarkers,
  MarkerTooltipContent,
  useActiveMarkers,
} from "@/components/charts/chart-markers";
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

function SaleMarkerContent({ markers }: { markers: ChartMarker[] }) {
  const activeMarkers = useActiveMarkers(markers);
  if (activeMarkers.length === 0) {
    return null;
  }
  return <MarkerTooltipContent markers={activeMarkers} />;
}

export function PriceHistoryChart({ history, sales }: PriceHistoryChartProps) {
  if (history.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No price history available for this token.
      </p>
    );
  }

  const chartData = history.map((p) => ({
    date: new Date(p.date),
    price: p.price,
  }));

  const lastPrice = chartData.at(-1)?.price ?? 0;

  // Create markers for each sale
  const markers: ChartMarker[] = sales.map((sale) => ({
    date: new Date(sale.date),
    icon: <EthIcon height="14px" />,
    title: `Ξ ${sale.price}`,
    description: sale.marketplace,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <EthIcon className="text-foreground" height="20px" />
        <span className="font-mono font-semibold text-xl">{lastPrice}</span>
        <span className="text-muted-foreground text-xs">current price</span>
      </div>

      <LineChart
        aspectRatio="3 / 1"
        data={chartData}
        margin={{ top: 50, right: 40, bottom: 40, left: 40 }}
        xDataKey="date"
      >
        <Grid horizontal />
        <Line dataKey="price" stroke="var(--foreground)" strokeWidth={2} />
        <ChartMarkers items={markers} size={24} />
        <XAxis />
        <ChartTooltip
          rows={(point) => {
            const p = point as Record<string, unknown>;
            return [
              {
                color: "var(--foreground)",
                label: "Price",
                value: `Ξ ${p.price}`,
              },
            ];
          }}
        >
          <SaleMarkerContent markers={markers} />
        </ChartTooltip>
      </LineChart>
    </div>
  );
}
