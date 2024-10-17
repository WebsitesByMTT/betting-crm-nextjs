"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function LineChartData({
  type,
  chartData,
  chartConfig,
  dataKey,
}: any) {
  return (
    <Card className="bg-dark_light_black dark:bg-[#dfdfdf62] w-full md:w-[50%] border-none my-4">
      <CardHeader>
        <CardTitle className="text-white dark:text-black capitalize text-md md:text-xl">
          {type}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {dataKey?.map((item: any) => (
              <Line
                key={item}
                dataKey={item}
                type="monotone"
                stroke={`var(--color-${item})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
