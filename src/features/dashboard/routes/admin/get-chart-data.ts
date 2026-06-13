import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth/middleware';
import { dashboardAdminBase, dashboardAdminPath } from './base';
import { getDashboardChartDataSchema } from '@/features/dashboard/schemas/get-chart-data';
import { IAdminDashboardChartDto, IAdminDashboardChartPointDto } from '@/features/dashboard/dtos/admin-dashboard-chart-dto';

function bucketByMonth(dates: Date[], months: number): IAdminDashboardChartPointDto[] {
  const now = new Date();
  const buckets = new Array(months).fill(0);

  for (const date of dates) {
    const monthsDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

    if (monthsDiff >= 0 && monthsDiff < months)
      buckets[months - 1 - monthsDiff]++;
  }

  return buckets.map((value, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    return { month: date.toISOString().slice(0, 7), value };
  });
}

export const adminDashboardGetChartData = dashboardAdminBase
  .route({
    method: 'GET',
    path: `${dashboardAdminPath}/chart-data`,
    summary: 'Get dashboard chart data',
    description: 'Returns monthly counts of news, banners and customer requests for the selected period',
  })
  .use(authMiddleware)
  .input(getDashboardChartDataSchema)
  .output(type<IAdminDashboardChartDto>())
  .handler(async ({ input: data }) => {
    const months = data.months ?? 6;
    const from = new Date();
    from.setMonth(from.getMonth() - (months - 1), 1);
    from.setHours(0, 0, 0, 0);

    const [news, banners, customerRequests] = await Promise.all([
      prisma.news.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true } }),
      prisma.banner.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true } }),
      prisma.customerRequest.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true } }),
    ]);

    return {
      news: bucketByMonth(news.map((item) => item.createdAt), months),
      banners: bucketByMonth(banners.map((item) => item.createdAt), months),
      customerRequests: bucketByMonth(customerRequests.map((item) => item.createdAt), months),
    };
  });
