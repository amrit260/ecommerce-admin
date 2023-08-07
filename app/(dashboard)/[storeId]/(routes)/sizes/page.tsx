import React from 'react';
import BillboardClient from './components/client';
import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import { SizesColumn } from './components/columns';
import { format } from 'date-fns';
interface SizesPageProps
  extends ServerComponentProps<{ storeId: string }, null> {
  // Add props here
}

const SizesPage = async ({ params }: SizesPageProps) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
