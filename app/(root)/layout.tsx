import Navbar from '@/components/navbar';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface SetupLayoutProps {
  children: React.ReactNode;
}

const SetupLayout = async (props: SetupLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: { userId },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
};

export default SetupLayout;
