import React from 'react';
import BillboardClient from './components/client';
import prismadb from '@/lib/prismadb';
import { ServerComponentProps } from '@/types';
import { OrderColumn } from './components/columns';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
interface OrdersPageProps
  extends ServerComponentProps<{ storeId: string }, null> {
  // Add props here
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedBillboards: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join('  '),
    totalPrice: formatPrice.format(
      item.orderItems.reduce(
        (acc, currentVal) => acc + currentVal.product.price.toNumber(),
        0
      )
    ),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default OrdersPage;
