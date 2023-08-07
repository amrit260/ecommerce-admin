import Navbar from '@/components/navbar';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface DashboardLayoutProps {
  params: { storeId: string };
  children: React.ReactNode;
}

const DashboardLayout = async ({ params, children }: DashboardLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
