import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import React from 'react';
import SizeForm from './components/size-form';

interface PageProps extends ServerComponentProps<{ sizeId: string }, null> {
  // Add props here
}

const Page = async ({ params }: PageProps) => {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
};

export default Page;
