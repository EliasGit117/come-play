import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { m } from '@/paraglide/messages'

const chartConfig = {
  news: {
    label: m['pages.admin.dashboard.stats.news'](),
    color: 'var(--chart-1)',
  },
  banners: {
    label: m['pages.admin.dashboard.stats.banners'](),
    color: 'var(--chart-2)',
  },
  customerRequests: {
    label: m['pages.admin.dashboard.stats.customerRequests'](),
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export interface IChartAreaLegendData {
  month: string;
  news: number;
  banners: number;
  customerRequests: number;
}

export function ChartAreaLegend(props: { data: IChartAreaLegendData[] }) {
  const { data } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m['pages.admin.dashboard.overview.title']()}</CardTitle>
        <CardDescription>{m['pages.admin.dashboard.overview.description']()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[300px] w-full'>
          <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Area
              dataKey='customerRequests'
              type='monotone'
              fill='var(--color-customerRequests)'
              fillOpacity={0.4}
              stroke='var(--color-customerRequests)'
              stackId='a'
            />
            <Area
              dataKey='banners'
              type='monotone'
              fill='var(--color-banners)'
              fillOpacity={0.4}
              stroke='var(--color-banners)'
              stackId='a'
            />
            <Area
              dataKey='news'
              type='monotone'
              fill='var(--color-news)'
              fillOpacity={0.4}
              stroke='var(--color-news)'
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
