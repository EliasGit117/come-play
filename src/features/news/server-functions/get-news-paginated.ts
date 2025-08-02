import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import z from 'zod';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { PaginationResultDto } from '@/features/common/pagination/pagination-result-dto';

export const getNewsPaginatedSchema = paginatedSchema.extend({});


export const getNewsPaginated = createServerFn({ method: 'GET' })
  .validator(paginatedSchema)
  .handler(async (data) => {
    const res = await prisma.news
      .paginate()
      .withPages({
        includePageCount: true,
        limit: 10,
        page: 1,
      });

    const a = res[1];

    return PaginationResultDto.fromPrismaPaginationRes(res);
  });