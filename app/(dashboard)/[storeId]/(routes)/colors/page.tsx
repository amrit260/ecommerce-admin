import React from 'react';
import ColorsClient from './components/client';
import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import { ColorsColumn } from './components/columns';
import { format } from 'date-fns';
interface ColorsPageProps
  extends ServerComponentProps<{ storeId: string }, null> {
  // Add props here
}

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const sizes = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedSizes: ColorsColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default ColorsPage;
