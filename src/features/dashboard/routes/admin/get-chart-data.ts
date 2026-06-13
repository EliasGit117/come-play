import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth/middleware';
import { dashboardAdminBase, dashboardAdminPath } from './base';
import { getDashboardChartDataSchema, TDashboardChartPeriod } from '@/features/dashboard/schemas/get-chart-data';
import { IAdminDashboardChartDto, IAdminDashboardChartPointDto } from '@/features/dashboard/dtos/admin-dashboard-chart-dto';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface IBucketingPlan {
  from: Date;
  buckets: number;
  bucketSizeMs?: number;
  unit: 'hour' | 'day' | 'week' | 'month';
}

function getBucketingPlan(period: TDashboardChartPeriod): IBucketingPlan {
  const now = new Date();

  switch (period) {
    case 'day':
      return { from: new Date(now.getTime() - 24 * HOUR_MS), buckets: 24, bucketSizeMs: HOUR_MS, unit: 'hour' };
    case 'week':
      return { from: new Date(now.getTime() - 7 * DAY_MS), buckets: 7, bucketSizeMs: DAY_MS, unit: 'day' };
    case 'month':
      return { from: new Date(now.getTime() - 30 * DAY_MS), buckets: 30, bucketSizeMs: DAY_MS, unit: 'day' };
    case '3months':
      return { from: new Date(now.getTime() - 12 * 7 * DAY_MS), buckets: 12, bucketSizeMs: 7 * DAY_MS, unit: 'week' };
    case 'year':
      return { from: new Date(now.getFullYear(), now.getMonth() - 11, 1), buckets: 12, unit: 'month' };
    case '6months':
    default:
      return { from: new Date(now.getFullYear(), now.getMonth() - 5, 1), buckets: 6, unit: 'month' };
  }
}

function formatLabel(date: Date, unit: IBucketingPlan['unit']): string {
  if (unit === 'hour')
    return date.toISOString().slice(11, 16);

  if (unit === 'month')
    return date.toISOString().slice(0, 7);

  return date.toISOString().slice(0, 10);
}

function bucketDates(dates: Date[], plan: IBucketingPlan): IAdminDashboardChartPointDto[] {
  const counts = new Array(plan.buckets).fill(0);

  for (const date of dates) {
    let index: number;

    if (plan.unit === 'month') {
      index = (date.getFullYear() - plan.from.getFullYear()) * 12 + (date.getMonth() - plan.from.getMonth());
    } else {
      index = Math.floor((date.getTime() - plan.from.getTime()) / plan.bucketSizeMs!);
    }

    if (index >= 0 && index < plan.buckets)
      counts[index]++;
  }

  return counts.map((value, index) => {
    let date: Date;

    if (plan.unit === 'month')
      date = new Date(plan.from.getFullYear(), plan.from.getMonth() + index, 1);
    else
      date = new Date(plan.from.getTime() + index * plan.bucketSizeMs!);

    return { label: formatLabel(date, plan.unit), value };
  });
}

export const adminDashboardGetChartData = dashboardAdminBase
  .route({
    method: 'GET',
    path: `${dashboardAdminPath}/chart-data`,
    summary: 'Get dashboard chart data',
    description: 'Returns bucketed counts of news, banners and customer requests for the selected period',
  })
  .use(authMiddleware)
  .input(getDashboardChartDataSchema)
  .output(type<IAdminDashboardChartDto>())
  .handler(async ({ input: data }) => {
    const plan = getBucketingPlan(data.period ?? '6months');

    const [news, banners, customerRequests] = await Promise.all([
      prisma.news.findMany({ where: { createdAt: { gte: plan.from } }, select: { createdAt: true } }),
      prisma.banner.findMany({ where: { createdAt: { gte: plan.from } }, select: { createdAt: true } }),
      prisma.customerRequest.findMany({ where: { createdAt: { gte: plan.from } }, select: { createdAt: true } }),
    ]);

    return {
      news: bucketDates(news.map((item) => item.createdAt), plan),
      banners: bucketDates(banners.map((item) => item.createdAt), plan),
      customerRequests: bucketDates(customerRequests.map((item) => item.createdAt), plan),
    };
  });
