import { z } from 'zod';

export const getDashboardChartDataSchema = z.object({
  months: z.number().int().min(1).max(24).optional().catch(6),
});

export type TGetDashboardChartDataSchema = z.infer<typeof getDashboardChartDataSchema>;
