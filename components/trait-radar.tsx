"use client";

import { useState } from "react";
import {
  Legend,
  LegendItem,
  LegendLabel,
  LegendMarker,
} from "@/components/charts/legend";
import { PieCenter } from "@/components/charts/pie-center";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";

interface Trait {
  trait_type: string;
  value: string;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export function TraitChart({ traits }: { traits: Trait[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const displayTraits = traits.slice(0, 8);

  if (displayTraits.length < 2) {
    return null;
  }

  // Equal slices so the donut is a visual index, not a data comparison
  const chartData = displayTraits.map((trait, i) => ({
    label: trait.value,
    value: 1,
    color: COLORS[i % COLORS.length],
  }));

  const legendItems = displayTraits.map((trait, i) => ({
    label: trait.trait_type,
    value: 0,
    color: COLORS[i % COLORS.length],
  }));

  const hoveredTrait =
    hoveredIndex !== null ? displayTraits[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <PieChart
        data={chartData}
        hoveredIndex={hoveredIndex}
        innerRadius={60}
        onHoverChange={setHoveredIndex}
        size={220}
      >
        {chartData.map((item, index) => (
          <PieSlice hoverEffect="grow" index={index} key={item.label} />
        ))}
        <PieCenter>
          {() => (
            <div className="text-center">
              <div className="font-bold text-2xl">
                {hoveredTrait ? hoveredTrait.value : displayTraits.length}
              </div>
              <div className="text-muted-foreground text-xs">
                {hoveredTrait ? hoveredTrait.trait_type : "Traits"}
              </div>
            </div>
          )}
        </PieCenter>
      </PieChart>

      <Legend
        className="flex-1"
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
      >
        <LegendItem className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1 text-xs" />
        </LegendItem>
      </Legend>
    </div>
  );
}
