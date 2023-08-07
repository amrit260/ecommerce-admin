import React from 'react';
import ProductClient from './components/client';
import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import { ProductColumn } from './components/columns';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
interface ProductPageProps
  extends ServerComponentProps<{ storeId: string }, null> {
  // Add props here
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatPrice.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
