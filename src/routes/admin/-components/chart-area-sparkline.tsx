import { Area, AreaChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartAreaSparkline(props: { data: { value: number }[] }) {
  const { data } = props;

  return (
    <ChartContainer config={chartConfig} className='aspect-auto h-[60px] w-full'>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator='line' hideLabel />}
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
