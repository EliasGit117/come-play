import { z } from 'zod';

export const dashboardChartPeriods = ['day', 'week', 'month', '3months', '6months', 'year'] as const;

export const getDashboardChartDataSchema = z.object({
  period: z.enum(dashboardChartPeriods).optional().catch('6months'),
});

export type TDashboardChartPeriod = (typeof dashboardChartPeriods)[number];
export type TGetDashboardChartDataSchema = z.infer<typeof getDashboardChartDataSchema>;
