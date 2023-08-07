import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import React from 'react';
import ColorForm from './components/color-form';

interface PageProps extends ServerComponentProps<{ colorId: string }, null> {
  // Add props here
}

const Page = async ({ params }: PageProps) => {
  const size = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={size} />
      </div>
    </div>
  );
};

export default Page;
