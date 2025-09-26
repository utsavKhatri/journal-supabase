"use client";

import { LabelList, Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export const description = "A pie chart with a label list";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type Datum = Record<string, string | number | undefined>;

type RoundedPieChartProps = {
  data?: Datum[];
  dataKey?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode | null;
  config?: ChartConfig;
  className?: string;
  badgeContent?: React.ReactNode;
};

export function RoundedPieChart({
  data = chartData,
  dataKey = "visitors",
  title = (
    <>
      Pie Chart
      <Badge
        variant="outline"
        className="text-green-500 bg-green-500/10 border-none ml-2"
      >
        <TrendingUp className="h-4 w-4" />
        <span>5.2%</span>
      </Badge>
    </>
  ),
  subtitle = "January - June 2024",
  config = chartConfig,
  className,
  badgeContent,
}: RoundedPieChartProps) {
  return (
    <Card className="flex flex-col relative">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className={
            className ??
            "[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
          }
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={dataKey} hideLabel />}
            />
            <Pie
              data={data}
              innerRadius={30}
              dataKey={dataKey}
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey={dataKey}
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor"
                formatter={(value: number) => value.toString()}
              />
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={String(entry.fill ?? `var(--chart-${(idx % 5) + 1})`)}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {badgeContent}
    </Card>
  );
}
