"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { MoreVertical } from 'lucide-react';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Computadora',
    color: '#475BE8',
  },
  mobile: {
    label: 'Móvil',
    color: '#DADEFA',
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <div>
      <div className='flex justify-between items-center mb-4 '>
        <div>
          <h2 className='text-xl font-semibold text-gray-800'>Visitas totales</h2>
          <p className='text-sm text-gray-500'>Mes pasado</p>
        </div>
        <button type='button' className='text-gray-400 hover:text-gray-600'>
          <MoreVertical className='h-5 w-5' />
        </button>
      </div>
      <ChartContainer config={chartConfig} className='min-h-[200px] max-h-[420px] w-full'>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='month'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
          <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default RevenueChart;