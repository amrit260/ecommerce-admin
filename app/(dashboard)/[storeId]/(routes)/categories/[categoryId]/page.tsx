import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import React from 'react';
import CategoryForm from './components/category-form';

interface PageProps
  extends ServerComponentProps<{ categoryId: string; storeId: string }, null> {
  // Add props here
}

const Page = async ({ params }: PageProps) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} category={category} />
      </div>
    </div>
  );
};

export default Page;
