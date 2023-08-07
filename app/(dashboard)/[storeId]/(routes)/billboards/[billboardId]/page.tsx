import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import React from 'react';
import BillboardForm from './components/billboard-form';

interface PageProps
  extends ServerComponentProps<{ billboardId: string }, null> {
  // Add props here
}

const Page = async ({ params }: PageProps) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm billboard={billboard} />
      </div>
    </div>
  );
};

export default Page;
