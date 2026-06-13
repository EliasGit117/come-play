export interface IAdminDashboardChartPointDto {
  month: string;
  value: number;
}

export interface IAdminDashboardChartDto {
  news: IAdminDashboardChartPointDto[];
  banners: IAdminDashboardChartPointDto[];
  customerRequests: IAdminDashboardChartPointDto[];
}
