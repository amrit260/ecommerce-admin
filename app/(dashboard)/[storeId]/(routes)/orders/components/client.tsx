'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Billboard } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { OrderColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />

      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
