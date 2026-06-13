import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { m } from '@/paraglide/messages'
import { dashboardChartPeriods, type TDashboardChartPeriod } from '@/features/dashboard/schemas/get-chart-data'

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

const periodLabels: Record<TDashboardChartPeriod, string> = {
  day: m['pages.admin.dashboard.periods.day'](),
  week: m['pages.admin.dashboard.periods.week'](),
  month: m['pages.admin.dashboard.periods.month'](),
  '3months': m['pages.admin.dashboard.periods.3months'](),
  '6months': m['pages.admin.dashboard.periods.6months'](),
  year: m['pages.admin.dashboard.periods.year'](),
}

export interface IChartAreaLegendData {
  label: string;
  news: number;
  banners: number;
  customerRequests: number;
}

export function ChartAreaLegend(props: {
  data: IChartAreaLegendData[];
  period: TDashboardChartPeriod;
  onPeriodChange: (period: TDashboardChartPeriod) => void;
}) {
  const { data, period, onPeriodChange } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m['pages.admin.dashboard.overview.title']()}</CardTitle>
        <CardDescription>{m['pages.admin.dashboard.overview.description']()}</CardDescription>
        <CardAction>
          <Select value={period} onValueChange={(value) => onPeriodChange(value as TDashboardChartPeriod)}>
            <SelectTrigger size='sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dashboardChartPeriods.map((value) => (
                  <SelectItem key={value} value={value}>{periodLabels[value]}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[300px] w-full'>
          <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='label'
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
