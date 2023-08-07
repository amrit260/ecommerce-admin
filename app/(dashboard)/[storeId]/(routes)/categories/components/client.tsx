'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Billboard } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { CategoryColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Api calls for categoreis" />
      <Separator />
      <ApiList entityIdName={'categoryId'} entityName="categories" />
    </>
  );
};

export default CategoryClient;
