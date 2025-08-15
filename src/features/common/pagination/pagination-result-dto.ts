import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types';

export class PaginationResultBase<T> {
  items: T[];
  page: number;

  constructor(params: { items: T[]; page: number }) {
    this.items = params.items;
    this.page = params.page;
  }
}

export class PaginationResultDto<T> extends PaginationResultBase<T> {
  constructor(params: { items: T[]; page: number }) {
    super(params);
  }

  static fromPrismaPaginationRes<T>(data: [T[], PageNumberPagination]) {
    const [items, meta] = data;
    return new PaginationResultDto({
      items,
      page: meta.currentPage,
    });
  }
}

export class PaginationResultWithCountDto<T> extends PaginationResultBase<T> {
  pageCount: number;
  totalCount: number;

  constructor(params: { items: T[]; page: number; pageCount: number; totalCount: number }) {
    super({ items: params.items, page: params.page });
    this.pageCount = params.pageCount;
    this.totalCount = params.totalCount;
  }

  static fromPrismaPaginationRes<T>(
    items: T[],
    meta: PageNumberPagination & PageNumberCounters
  ) {
    return new PaginationResultWithCountDto({
      items,
      page: meta.currentPage,
      pageCount: meta.pageCount,
      totalCount: meta.totalCount,
    });
  }
}
