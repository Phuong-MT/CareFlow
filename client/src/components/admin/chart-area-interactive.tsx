"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { z } from "zod"

export const schema = z.object({
  date: z.string(),
  pending: z.number(),
  serving: z.number(),
  success: z.number(),
})


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  pending: {
    label: "pending",
    color: "var(--chart-3)",
  },
  serving: {
    label: "serving",
    color: "var(--chart-1)",
  },
  success: {
    label: "success",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({chartData: initialData,onDateChange}: 
  {chartData: z.infer<typeof schema>[], onDateChange?: (startDate: string) => void})
 {
    const [chartData, setDataChart] = React.useState(() => initialData)
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])
  React.useEffect(() => {
    const referenceDate = new Date("2024-06-30") // bạn có thể dùng new Date() nếu cần hôm nay
    const map: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    }
  
    const daysToSubtract = map[timeRange] || 90
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
  
    onDateChange?.(timeRange) // optional chaining
  
  }, [timeRange])
  const getDateRange = (days: number) => {
    const today = new Date();
    const dateRange = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateRange.push(date.toISOString().split('T')[0]); // Chỉ lấy ngày (yyyy-mm-dd)
    }

    return dateRange;
  };
  const parseTimeRange = (timeRange: string) => {
    const match = timeRange.match(/^(\d+)(d|m)$/);
    if (match) {
      const value = parseInt(match[1], 10);
      if (match[2] === 'd') {
        return value;
      }
    }
    return 30;
  };

  const fillMissingData = (data: z.infer<typeof schema>[], days: number) => {
    const dateRange = getDateRange(days);
    const filledData = dateRange.map(datetime => {
      const existingData = data.find(d => {
        const dDate = new Date(d.date).toISOString().split('T')[0];
        return dDate === datetime;
      });
      if (existingData) {
        return existingData;
      } else {
        return {
          date: datetime,
          pending: 0,
          serving: 0,
          success: 0,
        };
      }
    });

    return filledData;
  };
  React.useEffect(() => {
    if (chartData.length === 0) return;
    const days = parseTimeRange(timeRange);
    const filledData = fillMissingData(initialData, days);
    setDataChart(filledData);
  }, [timeRange, initialData]);
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.pending.color} stopOpacity={1.0} />
                <stop offset="95%" stopColor={chartConfig.pending.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillServing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.serving.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.serving.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.success.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.success.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke={chartConfig.pending.color}
              stackId="a"
            />
            <Area
              dataKey="serving"
              type="natural"
              fill="url(#fillServing)"
              stroke={chartConfig.serving.color}
              stackId="a"
            />
            <Area
              dataKey="success"
              type="natural"
              fill="url(#fillSuccess)"
              stroke={chartConfig.success.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
