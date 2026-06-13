export interface IAdminDashboardChartPointDto {
  label: string;
  value: number;
}

export interface IAdminDashboardChartDto {
  news: IAdminDashboardChartPointDto[];
  banners: IAdminDashboardChartPointDto[];
  customerRequests: IAdminDashboardChartPointDto[];
}
