"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { type Order, type OrderStatus } from '@/types';
import { OrderListItem } from '@/components/orders/order-list-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrdersFromSheet, updateOrderStatusInSheet } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


const orderStatuses: OrderStatus[] = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const result = await getOrdersFromSheet();
      if (result.success && result.data) {
        setOrders(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: result.error || "Could not fetch orders from Google Sheet.",
        });
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [toast]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistically update UI
    const originalOrders = [...orders];
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));

    const result = await updateOrderStatusInSheet(orderId, status);

    if (!result.success) {
      // Revert UI on failure
      setOrders(originalOrders);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.error || "Could not update the order status.",
      });
    } else {
       toast({
        title: "Order Updated",
        description: `Order ${orderId} status set to ${status}.`,
      });
    }
  };

  const filteredOrders = currentTab === 'all'
    ? orders
    : orders.filter(order => order.status === currentTab);
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Order Management"
        description="View and manage customer orders for your online shop from Google Sheets."
      />
      <div className="px-4 md:px-6 pt-4">
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as OrderStatus | 'all')}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all" className="font-body">All</TabsTrigger>
            {orderStatuses.map(status => (
              <TabsTrigger key={status} value={status} className="font-body capitalize">{status}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <OrderListItem key={`${order.id}-${index}`} order={order} onUpdateStatus={handleUpdateOrderStatus} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No orders found for this status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
