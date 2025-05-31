
"use client";
import { useState, type ReactNode, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListFilter } from 'lucide-react';
import { type Order, type OrderStatus, type OrderType } from '@/types';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';
import { OrderListItem } from '@/components/orders/order-list-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialOrders: Order[] = [
  { id: 'ORD001', customerName: 'Alice Smith', items: [{ itemId: '1', name: 'Margherita Pizza', qty: 1, price: 12.99 }], status: 'preparing', orderType: 'dine-in', tableNumber: '5', totalAmount: 12.99, timestamp: new Date().toISOString() },
  { id: 'ORD002', customerName: 'Bob Johnson', items: [{ itemId: '2', name: 'Spaghetti Carbonara', qty: 2, price: 15.50 }], status: 'placed', orderType: 'takeaway', totalAmount: 31.00, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'ORD003', customerName: 'Carol Williams', items: [{ itemId: '3', name: 'Caesar Salad', qty: 1, price: 9.75 }, { itemId: '4', name: 'Tiramisu', qty: 1, price: 7.00 }], status: 'delivered', orderType: 'delivery', totalAmount: 16.75, timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'ORD004', customerName: 'David Brown', items: [{ itemId: '1', name: 'Margherita Pizza', qty: 1, price: 12.99 }, { itemId: '5', name: 'Bruschetta', qty: 1, price: 8.50 }], status: 'ready', orderType: 'dine-in', tableNumber: '2', totalAmount: 21.49, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
];

const orderStatuses: OrderStatus[] = ['placed', 'preparing', 'ready', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setOrders(initialOrders);
  }, []);

  const handleAddOrder = (newOrderData: Omit<Order, 'id' | 'timestamp' | 'totalAmount'>) => {
    const totalAmount = newOrderData.items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const newOrder: Order = {
      ...newOrderData,
      id: `ORD${String(Date.now()).slice(-4)}`,
      timestamp: new Date().toISOString(),
      totalAmount,
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const filteredOrders = currentTab === 'all'
    ? orders
    : orders.filter(order => order.status === currentTab);
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Order Management"
        description="View, create, and manage customer orders."
        actions={<CreateOrderDialog menuItems={[]} onAddOrder={handleAddOrder} />}
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
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderListItem key={order.id} order={order} onUpdateStatus={handleUpdateOrderStatus} />
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
