import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { IconNews, IconPhoto, IconUsers } from '@tabler/icons-react'
import { m } from '@/paraglide/messages';
import { orpc } from '@/lib/orpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartAreaSparkline } from './-components/chart-area-sparkline'
import { ChartAreaLegend } from './-components/chart-area-legend'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: m['pages.admin.dashboard.title']() }] }),
  staticData: {
    breadcrumbs: { title: m['pages.admin.dashboard.title']() }
  },
})

function StatCard(props: { title: string; value?: number; chartData?: { value: number }[]; isPending: boolean; icon: React.ComponentType<{ className?: string }>; className?: string }) {
  const { title, value, chartData, isPending, icon: Icon, className } = props;

  return (
    <Card className={className}>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        <Icon className='size-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        {isPending
          ? <Skeleton className='h-8 w-16' />
          : <div className='text-2xl font-bold'>{value}</div>}
      </CardContent>
      <CardContent>
        <ClientOnly fallback={<Skeleton className='h-[60px] w-full' />}>
          {chartData && <ChartAreaSparkline data={chartData} />}
        </ClientOnly>
      </CardContent>
    </Card>
  )
}

function RouteComponent() {
  const newsQuery = useQuery(orpc.admin.news.search.queryOptions({ input: { page: 1, limit: 1 } }))
  const bannersQuery = useQuery(orpc.admin.banners.search.queryOptions({ input: {} }))
  const customerRequestsQuery = useQuery(orpc.admin.customerRequests.search.queryOptions({ input: { page: 1, limit: 1 } }))
  const chartDataQuery = useQuery(orpc.admin.dashboard.getChartData.queryOptions({ input: { months: 6 } }))

  return (
    <main className='container mx-auto px-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <StatCard
          title={m['pages.admin.dashboard.stats.news']()}
          value={newsQuery.data?.totalCount}
          chartData={chartDataQuery.data?.news}
          isPending={newsQuery.isPending}
          icon={IconNews}
        />
        <StatCard
          title={m['pages.admin.dashboard.stats.banners']()}
          value={bannersQuery.data?.length}
          chartData={chartDataQuery.data?.banners}
          isPending={bannersQuery.isPending}
          icon={IconPhoto}
        />
        <StatCard
          title={m['pages.admin.dashboard.stats.customerRequests']()}
          value={customerRequestsQuery.data?.totalCount}
          chartData={chartDataQuery.data?.customerRequests}
          isPending={customerRequestsQuery.isPending}
          icon={IconUsers}
          className='sm:col-span-2 lg:col-span-1'
        />
      </div>

      <div className='mt-4'>
        <ClientOnly fallback={<Skeleton className='h-[350px] w-full' />}>
          {chartDataQuery.data && (
            <ChartAreaLegend
              data={chartDataQuery.data.news.map((point, index) => ({
                month: point.month,
                news: point.value,
                banners: chartDataQuery.data!.banners[index]?.value ?? 0,
                customerRequests: chartDataQuery.data!.customerRequests[index]?.value ?? 0,
              }))}
            />
          )}
        </ClientOnly>
      </div>
    </main>
  )
}
