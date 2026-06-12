import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';

export async function deleteProductImage(productId: number, imageId: number) {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
  });

  if (!image) return;

  await prisma.$transaction(async (tx) => {
    const deletedOrder = image.order;

    await tx.productImage.delete({ where: { id: image.id } });

    await tx.productImage.updateMany({
      where: {
        productId,
        order: { gt: deletedOrder },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    await utapi.deleteFiles([`product-${image.id}`], { keyType: 'customId' });
  });
}
