import { getGraphRevenue } from '@/actions/get-graph-revenue';
import { getSalesCount } from '@/actions/get-sales-count';
import { getStockCount } from '@/actions/get-stock-count';
import { getTotalRevenue } from '@/actions/get-total-revenue';
import Overview from '@/components/overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import prismadb from '@/lib/prismadb';
import { formatPrice } from '@/lib/utils';
import { ServerComponentProps } from '@/types';
import { CreditCard, DollarSign, Package } from 'lucide-react';

import React from 'react';

interface DashboardPageProps
  extends ServerComponentProps<{ storeId: string }, null> {}
const DashboardPage: React.FC<DashboardPageProps> = async ({
  params,
}: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);

  const graphData = await getGraphRevenue(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatPrice.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-2">
              <CardTitle className="text-sm font-medium">
                Products In Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardTitle>Overview</CardTitle>
          <Overview data={graphData} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
