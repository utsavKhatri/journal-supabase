"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
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

const chartData = [
  { month: "January", desktop: 342 },
  { month: "February", desktop: 876 },
  { month: "March", desktop: 512 },
  { month: "April", desktop: 629 },
  { month: "May", desktop: 458 },
  { month: "June", desktop: 781 },
  { month: "July", desktop: 394 },
  { month: "August", desktop: 925 },
  { month: "September", desktop: 647 },
  { month: "October", desktop: 532 },
  { month: "November", desktop: 803 },
  { month: "December", desktop: 271 },
];

const defaultChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Datum = Record<string, string | number | undefined>;

type GradientBarChartProps = {
  data?: Datum[];
  dataKey?: string;
  xKey?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode | null;
  config?: ChartConfig;
};

export function GradientBarChart({
  data = chartData,
  dataKey = "desktop",
  xKey = "month",
  title = (
    <>
      Bar Chart
      <Badge
        variant="outline"
        className="text-green-500 bg-green-500/10 border-none ml-2"
      >
        <TrendingUp className="h-4 w-4" />
        <span>5.2%</span>
      </Badge>
    </>
  ),
  subtitle = "January - June 2025",
  config = defaultChartConfig,
}: GradientBarChartProps) {
  // The ChartContainer expects a ChartConfig mapping; we rely on the caller to
  // provide color keys that match `dataKey` if they want specific colors.
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              shape={<CustomGradientBar />}
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface CustomBarProps {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  dataKey?: string | number;
}

const CustomGradientBar = (props: CustomBarProps) => {
  const {
    fill = "var(--chart-1)",
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    dataKey,
  } = props;

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#gradient-bar-pattern-${dataKey})`}
      />
      <rect x={x} y={y} width={width} height={2} stroke="none" fill={fill} />
      <defs>
        <linearGradient
          id={`gradient-bar-pattern-${dataKey}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};
