import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import React from 'react';
import ProductForm from './components/product-form';

interface PageProps
  extends ServerComponentProps<{ productId: string; storeId: string }, null> {
  // Add props here
}

const Page = async ({ params }: PageProps) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          sizes={sizes}
          colors={colors}
          product={product}
        />
      </div>
    </div>
  );
};

export default Page;
