import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartAreaSparkline(props: { data: { label: string; value: number }[] }) {
  const { data } = props;

  return (
    <ChartContainer config={chartConfig} className='aspect-auto h-[100px] w-full'>
      <AreaChart accessibilityLayer data={data} margin={{ top: 4, right: 12, left: 12, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='label'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={10}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator='line' />}
        />
        <Area
          dataKey='value'
          type='monotone'
          fill='var(--color-value)'
          fillOpacity={0.4}
          stroke='var(--color-value)'
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
