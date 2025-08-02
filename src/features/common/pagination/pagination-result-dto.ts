import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types';

export class PaginationResultDto {
  page: number;

  constructor(params: PaginationResultDto) {
    this.page = params.page;
  }


  static fromPrismaPaginationRes<T>(data: [T[], (PageNumberPagination)]) {
    const meta = data[1];

    return new PaginationResultDto({
      page: meta.currentPage,
    })
  }
}

export class PaginationResultWithCountDto extends PaginationResultDto {
  

  constructor(params: PaginationResultWithCountDto) {
    super({
      page: params.page,
    });
  }


  static fromPrismaPaginationRes<T>(data: [T[], (PageNumberPagination & PageNumberCounters)]) {
    const meta = data[1];

    return new PaginationResultWithCountDto({
      page: meta.currentPage,
    })
  }
}