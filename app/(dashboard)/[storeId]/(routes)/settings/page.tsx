import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import SettingsForm from './components/settings-form';

interface PageProps extends ServerComponentProps<{ storeId: string }, null> {
  // Add props here
}

const Page = async ({ params }: PageProps) => {
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
    <div className="felx-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm store={store} />
      </div>
    </div>
  );
};

export default Page;
