import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { IAdminBannerDto, IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';
import { editBannerSchema } from '@/features/banners/schemas/edit-banner';


export const editBanner = createServerFn({ method: 'GET' })
  .inputValidator(editBannerSchema)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;

    const res = await prisma.banner.update({
      where: { id },
      data: {
        ...updateData,
        path: updateData.path || null
      }
    });

    return IAdminBannerDtoFactory.fromEntity(res);
  });

type TParams = Parameters<typeof editBanner>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminBannerDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useEditBannerMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['banners', 'edit'],
    mutationFn: (values) => editBanner({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'banners' && query.queryKey[1] === 'paginated'
      });
      void queryClient.invalidateQueries({ queryKey: ['banners', data.id] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};