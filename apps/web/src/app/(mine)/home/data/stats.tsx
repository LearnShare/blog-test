'use client';

import React from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  {
    label: '02-05',
    value: 112,
  },
  {
    label: '02-06',
    value: 85,
  },
  {
    label: '02-07',
    value: 234,
  },
  {
    label: '02-08',
    value: 185,
  },
  {
    label: '02-09',
    value: 76,
  },
  {
    label: '02-10',
    value: 147,
  },
  {
    label: '02-11',
    value: 182,
  },
];

const chartConfig = {
  value: {
    label: "阅读量",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

function DataStats() {
  return (
    <div className="flex flex-col gap-3 flex-1 border rounded-lg border-gray-200 p-4 max-w-[calc((100%-24px)/2)]">
      <h3 className="text-sm text-slate-600 flex justify-between items-center">本周阅读数据</h3>
      <ChartContainer config={chartConfig}>
        <BarChart
            accessibilityLayer
            data={ chartData }
            margin={ {
              top: 20,
            } }>
          <CartesianGrid
              vertical={ false } />
          <XAxis
              dataKey="label"
              tickLine={ false }
              tickMargin={ 10 }
              axisLine={ false } />
          <ChartTooltip
              cursor={ false }
              content={ <ChartTooltipContent hideLabel /> } />
          <Bar
              dataKey="value"
              fill="var(--chart-4)"
              radius={ 8 }
              barSize={ 16 }>
            <LabelList
                position="top"
                offset={ 12 }
                className="fill-foreground"
                fontSize={ 12 } />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default DataStats;
